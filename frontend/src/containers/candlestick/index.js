import * as d3 from "d3"

export const CandlestickChart = async(chartObject) => {
        
    const xFormat = "%m-%d-%y";
    const yFormat = "~f";
    const title = 'AAPL';
    // console.log(index)
    // console.log(chartObjectData[index])

    let chartData = chartObject

    console.log(chartObject)
    console.log(chartObject.chartDate)
    console.log(chartObject.chartDate[0])
    
    // console.log(symbol)
    const symbol = ''
    console.log(symbol)
    const containerSize = document.querySelector(".ChartContainer").getBoundingClientRect()
    console.log(containerSize.height)
    console.log(containerSize.width)
    //sets up the image h, w, and margins
    const marginTop = 50;
    const marginRight = 50;
    const marginBottom = 50;
    const marginLeft = 50;
    const width = containerSize.width * .95;
    const height = containerSize.height * .95;
    // const width = "100%";
    // const height = "100%";
    // const marginTop = "8%";
    // const marginRight = "5%";
    // const marginBottom = "8%";
    // const marginLeft = "6%";



    //generates the OHLC 
    let X = d3.map(chartObject.chartDate[0], x => {
        // let isoFormat = d3.utcParse("%a %B %d %Y")
        // console.log(isoFormat(x))
        // let formattedDate = d3.utcFormat("%m-%d-%y")
        // console.log(formattedDate(new Date(localizedDate)))
        console.log(x)
        // console.log(Date.getUTCDay(x))
        return x
    });
    const Yo = d3.map(chartObject.chartOpen[0], x => x);
    const Yc = d3.map(chartObject.chartClose[0], x => x);
    const Yh = d3.map(chartObject.chartHigh[0], x => x);
    const Yl = d3.map(chartObject.chartLow[0], x => x);

    //I is the index we are using for the chart object
    const I = d3.range(X.length);
    console.log(I)

    console.log(X)

    console.log(Yo)
    console.log(Yc)
    console.log(Yh)
    console.log(Yl)

    //sets up the domain of the chart 

    const minDay = new Date(d3.min(X));
    const maxDay = new Date(d3.max(X));
    console.log(minDay)

    // this is the sets the domain in terms of days
    const weeks = (start, stop, stride) => d3.utcMonday.every(stride).range(start, +stop +1);
    const weekdays = (start, stop) => {
        d3.utcDays(start, stop).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)
    }

    // if (xDomain === undefined) xDomain = weekdays(d3.min(X), d3.max(X));
    // if (yDomain === undefined) yDomain = [d3.min(Yl), d3.max(Yh)];
    // if (xTicks === undefined) xTicks = weeks(d3.min(xDomain), d3.max(xDomain), 2);

    //sets up the x axis line and scale
    // const xTicks = weekdays(d3.min(X), d3.max(X), 2);
    // const xTicks = X
    
    const xPadding = 0.2;
    // const xDomain = weekdays(minDay, maxDay)
    // const xDomain = weeks(minDay, maxDay, 4)
    const xDomain = X
    //this is the monthly/every 4 weeks
    console.log(weeks(minDay, maxDay, 4))

    //this is the weekly/every 1 weeks
    console.log(weeks(minDay, maxDay, 1))
    console.log(weekdays(minDay, maxDay))

    // const xDomain = X
    // console.log(xTicks)
    // const xDomain = d3.utcDays(minDay, maxDay).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)

    const xRange = [marginLeft, width - marginRight];
    const xScale = d3.scaleBand(xRange).domain(xDomain).range(xRange).padding(xPadding);
    // const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding)
    const xAxis = d3.axisBottom(xScale)//.tickFormat(xFormat);//.tickValues(xTicks)
    console.log(xScale)
    console.log(xDomain)
    // console.log(d3.domain(xDomain))

    // console.log(xScale)
    //sets up the y axis line and scale
    const yDomain = [(d3.min(Yl)*.9), (d3.max(Yh)*1.1)];
    // const yDomain = [100,500];
    const yRange = [height - marginBottom, marginTop];
    const yLabel = "Price $";
    const yType = d3.scaleLinear;
    const yScale = yType(yDomain, yRange);
    const yAxis = d3.axisLeft(yScale).ticks(height / 100, yFormat);


    console.log(yDomain);
    //sets up the line used for the candlestick
    const stroke = "currentColor";
    const strokeLinecap = "round";
    const colors = ["#9ECD6F", "#49464E", "#F85E84"];


    // generate the chart using the stated variables to the ref
    const svg = d3.select(svgRef.current)
        // .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("fill", "cream")
        .attr("fill_opacity", "1")
        // .attr("style", "max-width: 100%; hegiht: auto; height: intrinsic;")
        // .style('position', 'relative')
        // .join('path')

    svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#2D2A2E")
    // .data(I)
    // .attr("x-axis track", i => console.log(i))
    // .on('mouseover', (e,d, i)=> {
    //     // data(I)
    //         // console.log(e)
    //         // console.log(d)
    //         // console.log(i)
            
    //         // console.log(Yl[0][d])
    //         // console.log(Yh[0][d])
    //         // console.log(Yo[0][d])
    //         // console.log(Yc[0][d])
    //     tooltip.style('visibility', 'visible')
    //         .text(`Open: ${Yo[0][d]}
    //         High: ${Yh[0][d]}
    //         Low: ${Yl[0][d]}
    //         Close: ${Yc[0][d]}`)
    //         .attr("disabled", true)
    //         .style("height", "120px")
    //         .style("width", "auto")
    //         .style("resize", "none")
    // })
    
    
    const tooltip = d3.select('#svgEle')
    .append('g')
    .data(I)
    .style('visibility','hidden')
    .style("z-index", "10")
    // .style('position','relative')
    .style('background-color','red')
    // .append("text")
    //     .text(`Open: ${Yo[0][1]}`)
    // .append("text")
    //     .text(`High: ${Yh[0][1]}`)
    // .append("text")
    //     .text(`Low: ${Yl[0][1]}`)
    // .append("text")
    //     .text(`Close: ${Yc[0][1]}`)
    .append("g")
        .append("textArea")
        .style('position','absolute')
        .attr("disabled", true)
    //                 .text(`Open: ${Yo[0][1]}
    // High: ${Yh[0 ][1]}
    // Low: ${Yl[0][1]}
    // Close: ${Yc[0][1]}`)
        // .style("height", "200px")
        // .style("width", "auto")
        // .style("resize", "none")
    
    //X Axis Date Scale
    svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .style("font-size", "12px")
    .call(xAxis)
    .call(g => g.select(".domain").remove());

    // svg.append("g")
    //     .attr("width","10%")
    //     .attr("height","10%")
    //     .attr("transform", `translate(${width/2})`)

    //     .call(g => g.append("text")
    //         .attr("text-anchor", "start")
    //         .style("font-size", "64px")
    //         .style("font-color", "black")
    //         .text(symbol)
            
    //     )

    //Title
    d3.select("svg")
    // .append("rect")
    // .attr("fill", "yellow")
    .append("text")
    .attr("transform", `translate(${width/2}, ${marginTop})`)
    .style("font-size", "64px")
    .style("font-color", "black")
    .text(symbol)
        

    //Y Axis Price Scale Label
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .style("font-size", "18px")
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("stroke-opacity", 0.2)
            .attr("x2", width - marginLeft - marginRight))
            
        //Y Axis Label    
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", marginTop)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .style("font-size", "28px")
            .text(yLabel));
    
    //X Axis for candlesticks
    const g = svg.append("g")
        .attr("transform", `translate(${marginLeft}, ${marginBottom})`)
        .attr("stroke", stroke)
        // .attr("font-color", "red")
        .attr("stroke-linecap", strokeLinecap)
    .selectAll("g")
    .data(I)
    .join("g")
        .attr("transform", i => `translate(${xScale(X[i])},0)`)

        console.log(I)

    // const xScaleArr = [xScaleComplete]
    const xScaleComplete = X.map(x => {
        console.log(x)
        return xScale(X[x])
    })
    // console.log(xScaleArr)

    console.log(xScale(X))
    console.log(xScale(X[2]))
    console.log(xScale(X[3]))
    console.log(xScale(X[4]))
    console.log(X)
    console.log(X[1])
    // console.log(X[0][1])
    console.log(Yl[1])
    // console.log(Yl[0][1])
    
    //Y Axis Candlesticks: Low High Stick
    g.append("line")
    .attr("y1", i => yScale(Yl[i]))
    .attr("y2", i => yScale(Yh[i]));
    
    //Y Axis Candlesticks: Open Close Candle
    g.append("line")
    .attr("y1", i => yScale(Yo[i]))
    .attr("y2", i => yScale(Yc[i]))
    .attr("stroke-width", (xScale.bandwidth()/2))
    .attr("stroke", i => colors[1 + Math.sign(Yo[i] - Yc[i])]);
    
    //X Axis Line interface()
    // g.append("line")
    // .attr("y1", i => yScale(marginBottom))
    // .attr("y2", i => yScale(height))
    // .attr("stroke-width", xScale.bandwidth())
    // // .style("visibility", "hidden")
    // .style("opacity", "0")
    // .on('mouseover', (e,d)=> {
    //     console.log(e)
    //     console.log(d)
    
    //     console.log(Yl[d])
    //     console.log(Yh[d])
    //     console.log(Yo[d])
    //     console.log(Yc[d])
    //     tooltip.style('visibility', 'visible')
    //         .style("opacity", "1")
    //         .text(`Open: ${Yo[d]}
    //         High: ${Yh[d]}
    //         Low: ${Yl[d]}
    //         Close: ${Yc[d]}`)
    //         .attr("disabled", true)
    //         .style("height", "120px")
    //         .style("width", "auto")
    //         .style("resize", "none")
    
    // })
    
    console.log(svg.node())

    return svg.node();
}