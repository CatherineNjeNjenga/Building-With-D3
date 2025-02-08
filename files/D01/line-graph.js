import supabase from "./supabase-utils.js"

(async function (){
  // import data
  const { data } = await supabase
    .from('D1-D3')
    .select()
    console.log(data)
    const parseDate = d3.timeParse("%d/%m/%Y");

		data.forEach(d => {
			d.year = parseDate(d.Date);
		});

		// Create chart dimensions
		const width = 950;
		const height = 455;
		const margin = {
			top: 60,
			right: 60,
			bottom: 26,
			left: 60
		}

		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		// Draw canvas
		const wrapper_line_chart = d3.select("#container1")
			.append("svg")
			.attr("viewBox", "0 0 950 455")
			.attr("preserveAspectRatio", "xMidYMid meet");

		const bounds_line_chart = wrapper_line_chart.append("g")
			.style("transform", `translate(${margin.left}px, ${margin.top}px)`);

		const tooltip_line = d3.select("#container1")
			.append("div")
			.attr("id", "tooltip_line")
			.attr("class", "tooltip")
			.style("opacity", 0);

		// Create scales
		const x = d3.scaleTime()
			.domain(d3.extent(data, d => d.year))
			.range([0, innerWidth]);

		const y = d3.scaleLinear()
			.domain([d3.min(data, d => d["Unemployement Rate"]),
				d3.max(data, d => d["Unemployement Rate"])])
			.range([innerHeight, 0]);

		bounds_line_chart.append("g")
			.attr("transform", `translate(0,${innerHeight})`)
			.attr("class", "axis-x")
			.call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")));

		bounds_line_chart.append("g")
			.attr("transform", `translate(-50, -10)`)
			.attr("class", "axis-y")
			.call(d3.axisLeft(y).ticks(10));

		// Draw gridlines
		const yAxisGrid = d3.axisLeft(y)
			.tickSize(-innerWidth - 60)
			.tickFormat('')
			.ticks(10);

		const grid = bounds_line_chart.append('g')
			.attr('class', 'grid')
			.attr("transform", `translate(-60, 0)`)
			.call(yAxisGrid);

		grid.selectAll("line")
			.filter((d, i) => i === 0)
			.classed("first-line", true);

		// Draw data
		const line = d3.line()
			.x(d => x(d.year))
			.y(d => y(d["Unemployement Rate"]));
		// line.curve(d3.curveCardinal)
		bounds_line_chart.append("path")
			.datum(data)
			.attr("class", "line")
			.attr("d", line)
})()