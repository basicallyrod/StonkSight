import * as d3 from 'd3'

function CandlestickChart (data, {
    date = d => d.date,
    open = d => d.open,
    close = d => d.close,
    high = d => d.high,
    low = d => d.low,
    title = d => d.symbol,
    marginTop = 20,
    marginRight = 30,
    marginBottom = 30,
    marginLeft = 40,
    width = 640,
    height = 400,
    xDomain,
    xRange = [marginLeft, width - marginRight],
    xPadding = 0.2,
    xTicks,
    yType = d3.scaleLinear,
    yDomain,
    yRange = [height - marginBottom, marginTop],
    xFormat = "$b %-d",
    yFormat = "~f",
    yLabel,
    stroke = "currentColor",
    strokeLinecap = "round",
    colors = ["$4daf4a", "#999999", "#e41a1c"]
} = {}) {
    const X = d3.map(data, date);
    const Yo = d3.map(data, open);
    const Yc = d3.map(data, close);
    const Yh = d3.map(data, high);
    const Yl = d3.map(data, low);
    const I = d3.range(X.length);

    const weeks = (start, stop, stride) => d3.utcMonday.every(stride).range(start, +stop +1);
    const weekdays = (start, stop) => d3.utcDays(start, +stop + 1).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6);

    if (xDomain === undefined) xDomain = weekdays(d3.min(X), d3.max(X));
    if (yDomain === undefined) yDomain = [d3.min(Yl), d3.max(Yh)];
    if (xTicks === undefined) xTicks = weeks(d3.min(xDomain), d3.max(xDomain), 2)


    const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.utcFormat(xFormat)).tickValues(xTicks);
    const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

    if(title === undefined) {
        const formatData = d3.utcFormat("%B %-d, %Y");
        const formatValue = d3.format(".2f");
        const formatChange = (f => (y0, y1) => f((y1 - y0) / y0))(d3.format("+.2%"));
        title = i => `${formatData(X[i])}
    Open: ${formatValue(Yo[i])}
    Close: ${formatValue(Yc[i])} (${formatChange(Yo[i], Yc[i])})
    Low: ${formatValue(Yl[i])}
    High: ${formatValue(Yh[i])}`;
    } else if (title !== null) {
        const T = d3.map(data, title);
        title = i => T[i];
    }

    const svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; hegiht: auto; height: intrinsic;")
    
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis)
        .call(g => g.select(".domain").remove());

        svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("stroke-opacity", 0.2)
            .attr("x2", width - marginLeft - marginRight))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel));

    // if (title) g.append("title")
    //     .text(title);
    return svg.node();
    
}

export {CandlestickChart}


