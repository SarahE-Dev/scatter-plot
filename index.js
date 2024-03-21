

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(response => response.json())
  .then(data => {
    
    console.log(data);
    const dataset = data;

    const margin = { top: 20, right: 20, bottom: 50, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select('body')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('id', 'title')
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    
    const xScale = d3.scaleLinear()
      .domain([d3.min(dataset, d => d.Year - 1), d3.max(dataset, d => d.Year + 1)])
      .range([0, width]);

    const yScale = d3.scaleTime()
      .domain(d3.extent(dataset, d => new Date(d.Seconds * 1000)))
      .range([height, 0]);

      const legend = svg.append('g')
      .attr('id', 'legend')
      .attr('transform', `translate(${width - 100},${height - 100})`);


      legend.append('circle')
      .attr('cx', 10)
      .attr('cy', 10)
      .attr('r', 5)
      .style('fill', 'red');

    legend.append('text')
      .attr('x', 20)
      .attr('y', 10)
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .text('Doping Allegations');

    legend.append('circle')
      .attr('cx', 10)
      .attr('cy', 30)
      .attr('r', 5)
      .style('fill', 'green');

    legend.append('text')
      .attr('x', 20)
      .attr('y', 30)
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .text('No Doping Allegations');

    svg.selectAll('circle')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.Year))
      .attr('cy', d => yScale(new Date(d.Seconds * 1000)))
      .attr('r', 5)
      .attr('class', 'dot')
      .attr('data-xvalue', d => d.Year)
      .attr('data-yvalue', d => new Date(d.Seconds * 1000))
      .style('fill', d => d.Doping ? 'red' : 'green')
      .on('mouseover', (event, d) => {
        tooltip.style('opacity', 0.9);
        tooltip.html(`${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time: ${d.Time}<br>${d.Doping ? d.Doping : 'No doping allegations'}`)
          .attr('data-year', d.Year)
          .style('left', event.pageX + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });

    
    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .attr('id', 'x-axis')
      .call(d3.axisBottom(xScale).tickFormat(d3.format('d')))
      .append('text')
      .attr('x', width / 2)
      .attr('y', margin.bottom - 10)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Year');

    svg.append('g')

      .attr('id', 'y-axis')
      .call(d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S')))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 20)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Time in Minutes');

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 0 - margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .text('Doping in Professional Bicycle Racing');

    const tooltip = d3.select('body')
      .append('div')
      .attr('id', 'tooltip')
      .style('opacity', 0);
  })
  .catch(error => console.log('Error fetching data:', error));