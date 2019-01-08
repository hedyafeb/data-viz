const allData = window.data
let eachAge = {}

allData.forEach(participant => {
    if (eachAge[participant.Age] == undefined) {
        eachAge[participant.Age] = 1
    }
    else {
        eachAge[participant.Age] += 1
    }
})

let dataset = Object.values(eachAge)
let infoChart = Object.keys(eachAge)


let svgWidth = 500
let svgHeight = 500
let barPadding = 5
let barWidth = (svgWidth / dataset.length);

let svg = d3.select('svg')
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .style('background', '#efefef')


let colorScale = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range(['#565656', '#C09F80'])

let heightScale = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([0, svgHeight - 50])



let barChart = svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr('y', (d) => {
        return svgHeight - heightScale(d) - 2
    })
    .attr("height", function(d) { 
        return heightScale(d); 
    })
    .attr("width", barWidth - barPadding)
    .attr("transform", function (d, i) {
        var translate = [barWidth * i, 0]; 
        return "translate("+ translate +")";
    })
    .attr('fill', colorScale)
    .on("mouseover", function (d) {
        let currentEl = d3.select(this);
        currentEl.attr("fill", "#76323F");
        })
    
    .on('mouseout', function (d) {
        let currentEl = d3.select(this);
        currentEl.attr('fill', colorScale);
        })

let info = svg.selectAll('text')
    .data(dataset)
    .enter()
    .append('text')
    .text(function(d){
        return d
    })
    .attr('y', function(d, i) {
        return svgHeight - heightScale(d) - 5
    })
    .attr("height", function(d) { 
        return d
    })
    .attr('x', function(d, i) {
        return barWidth * i + 5
    })
    .attr('fill', 'black')

let infoAge = svg.selectAll('age')
    .data(infoChart)
    .enter()
    .append('text')
    .text(function(d){
        return d
    })
    .attr('y', function(d, i) {
        return svgHeight - 5
    })
    .attr("height", function(d) { 
        return d
    })
    .attr('x', function(d, i) {
        return barWidth * i + 5
    })
    .attr('fill', 'white')



// SECOND CHART:
let eachGender = [
    {
        gender: 'female',
        number: 0,
        percentage: 0
    },
    {
        gender: 'male',
        number: 0,
        percentage: 0
    }
]

let totalParticipant = 0

allData.forEach(participant => {
    totalParticipant++
    if (participant.Sex === 'F') {
        eachGender[0].number++
        eachGender[0].percentage = ((eachGender[0].number / totalParticipant) * 100).toFixed(2)
    }
    else {
        eachGender[1].number++
        eachGender[1].percentage = ((eachGender[1].number / totalParticipant) * 100).toFixed(2)
    }
});

 
// console.log(eachGender, totalParticipant);
let data = Object.values(eachGender)


var radius =  Math.min(svgWidth, svgHeight) / 2;
var svg2 = d3.select('#secondChart')
    .append('svg')
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var g = svg2.append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")") ;

var color = d3.scaleOrdinal(d3.schemeCategory10);

var pie = d3.pie().value(function(d) { 
     return d.number; 
});

var path = d3.arc()
    .outerRadius(radius)
    .innerRadius(0);
 
var arc = g.selectAll("arc")
    .data(pie(data))
    .enter()
    .append("g");

arc.append("path")
    .attr("d", path)
    .attr("fill", function(d) { return color(d.data.number); });
        
var label = d3.arc()
    .outerRadius(radius)
    .innerRadius(0);
            
arc.append("text")
    .attr("transform", function(d) { 
        return "translate(" + label.centroid(d) + ")"; 
    })
    .attr("text-anchor", "middle")
    .text(function(d) { return d.data.gender+": "+d.data.percentage+"%"; });

arc.on("mouseover", function (d) {
    let currentEl = d3.select(this);
    currentEl.attr("style", "fill-opacity:0.5;");
    })

arc.on('mouseout', function (d) {
    let currentEl = d3.select(this);
    currentEl.attr("style", "fill-opacity:1;");
    })