import { useEffect, useRef } from "react";
import * as d3 from "d3";

const BenefitForecastGraph = ({ myForecast }) => {
  const svgRef = useRef();

  // // 연도별 데이터 추출 및 가공
  // const processData = () => {
  //   const yearKeys = Object.keys(myMonthlyPrice);
  //   const processedData = [];

  //   yearKeys.forEach(year => {
  //     const yearData = myMonthlyPrice[year];
  //     yearData.forEach(item => {
  //       processedData.push({
  //         ...item,
  //         year: parseInt(year) // 문자열로 된 연도를 숫자로 변환
  //       });
  //     });
  //   });

  //   return processedData;
  // };

  // D3(dom)과 react(가상dom)결함 - 데이터 변경 되면 다시 그릴 수 있도록 하는 기능
  useEffect(() => {
    if (!myForecast || !svgRef.current) return;

    const allData = myForecast.monthly_data

    // svg 컨테이너 설정
    const svg = d3.select(svgRef.current);
    const width = 800; // px
    const height = 400;
    const margin = { top: 20, right: 80, bottom: 60, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg
      .attr("width", width) // svg 요소 속성 설정
      .attr("height", height);

    const g = svg.selectAll(".chart-group").data([null]); // svg 내부에서 chart-group 클래스 모든 요소 선택 및 데이터 바인딩
    //  null - 그래프 컨테이너 하나가 필요하기 때문에 사용하는 것
    // 없으면 새로 만들기
    const gEnter = g.enter().append("g").attr("class", "chart-group");
    // 새로 만든 것을 합쳐서 g로 다루기
    const gMerged = gEnter.merge(g);
    gMerged.attr("transform", `translate(${margin.left}, ${margin.top})`);

    // 데이터 변환을 위한 연도 추출
    const years = [...new Set(allData.map(d => d.year))].sort();
    
    // 색상 스케일 설정
    const colorScale = d3.scaleOrdinal()
    .domain(years)
    .range(['#4CAF50', '#2196F3', '#FFC107', '#FF5722', '#9C27B0']);

    // x축 스케일 (월)
    const xScale = d3.scaleLinear().domain([1, 12]).range([0, innerWidth]);

    // y축 스케일 (가격)
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(allData, (d) => d.price_forecast) * 1.1])
      .range([innerHeight, 0]);

    // 선 생성기
    const lineGenerator = d3
      .line()
      .x((d) => xScale(d.month))
      .y((d) => yScale(d.price_forecast))
      .curve(d3.curveMonotoneX);

    // x축 그리기
    const xAxis = gMerged.selectAll(".x-axis").data([null]);
    const xAxisEnter = xAxis.enter().append("g").attr("class", "x-axis");
    const xAxisMerged = xAxisEnter.merge(xAxis);

    xAxisMerged.attr("transform", `translate(0, ${innerHeight})`).call(
      d3
        .axisBottom(xScale)
        .tickFormat((d) => `${d}월`)
        .tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    );

    // x축 라벨
    const xLabel = gMerged.selectAll(".x-label").data([null]);
    const xLabelEnter = xLabel.enter().append("text").attr("class", "x-label");
    const xLabelMerged = xLabelEnter.merge(xLabel);

    xLabelMerged
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 50)
      .style("text-anchor", "middle")
      .text("월");

    // y축 그리기
    const yAxis = gMerged.selectAll('.y-axis').data([null]);
    const yAxisEnter = yAxis.enter().append('g').attr('class', 'y-axis');
    const yAxisMerged = yAxisEnter.merge(yAxis);
    
    yAxisMerged
      .call(d3.axisLeft(yScale).ticks(10).tickFormat(d => `${d.toLocaleString()}원`));

    // y축 라벨
    const yLabel = gMerged.selectAll('.y-label').data([null]);
    const yLabelEnter = yLabel.enter().append('text').attr('class', 'y-label');
    const yLabelMerged = yLabelEnter.merge(yLabel);
    
    yLabelMerged
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -60)
      .style('text-anchor', 'middle')
      .text('예상 가격 (원)');

    // 각 연도별 데이터셋 생성
    const yearlyData = years.map(year => {
      return {
        year,
        color: colorScale(year),
        values: allData.filter(d => d.year === year).sort((a, b) => a.month - b.month)
      };
    });
    

    // 각 연도별 선 그래프 그리기
    const yearLines = gMerged.selectAll('.year-line').data(yearlyData);
    const yearLinesEnter = yearLines.enter().append('g').attr('class', 'year-line');
    const yearLinesMerged = yearLinesEnter.merge(yearLines);

    yearLinesMerged.each(function(d) {
      const yearGroup = d3.select(this);
      
      // 선 그리기
      const line = yearGroup.selectAll('.line').data([d]);
      const lineEnter = line.enter().append('path').attr('class', 'line');
      const lineMerged = lineEnter.merge(line);
      
      lineMerged
        .attr('d', d => lineGenerator(d.values))
        .attr('fill', 'none')
        .attr('stroke', d => d.color)
        .attr('stroke-width', 3)
        .attr('opacity', 0)
        .transition()
        .duration(1000)
        .attr('opacity', 1);

      // 데이터 포인트 그리기
      const circles = yearGroup.selectAll('.data-point').data(d.values);
      const circlesEnter = circles.enter().append('circle').attr('class', 'data-point');
      const circlesMerged = circlesEnter.merge(circles);
      
      circlesMerged
        .attr('cx', d => xScale(d.month))
        .attr('cy', d => yScale(d.price_forecast))
        .attr('r', 5)
        .attr('fill', d.color)
        .attr('opacity', 0)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 100)
        .attr('opacity', 1);
        
      circles.exit().remove();
    });

    // 툴팁 생성
    const tooltip = d3.select('body').selectAll('.tooltip').data([null]);
    const tooltipEnter = tooltip.enter().append('div').attr('class', 'tooltip');
    const tooltipMerged = tooltipEnter.merge(tooltip);
    
    tooltipMerged
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('border', '1px solid #ddd')
      .style('border-radius', '4px')
      .style('padding', '10px')
      .style('pointer-events', 'none');

    // 모든 데이터 포인트에 마우스 이벤트 추가
    gMerged.selectAll('.data-point')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(300)
          .attr('r', 8);
          
        tooltipMerged
          .transition()
          .duration(300)
          .style('opacity', 0.9);
          
        tooltipMerged
          .html(`<strong>${d.year}년 ${d.month}월</strong><br>예상 가격: ${d.price_forecast.toLocaleString()}원`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(300)
          .attr('r', 5);
          
        tooltipMerged
          .transition()
          .duration(500)
          .style('opacity', 0);
      });

    // 범례 그리기
    const legend = gMerged.selectAll('.legend').data([null]);
    const legendEnter = legend.enter().append('g').attr('class', 'legend');
    const legendMerged = legendEnter.merge(legend);
    
    legendMerged.attr('transform', `translate(${innerWidth + 20}, 0)`);

    const legendItems = legendMerged.selectAll('.legend-item').data(yearlyData);
    const legendItemsEnter = legendItems.enter().append('g').attr('class', 'legend-item');
    const legendItemsMerged = legendItemsEnter.merge(legendItems);
    
    legendItemsMerged.attr('transform', (d, i) => `translate(0, ${i * 25})`);

    // 범례 색상 선
    const legendLines = legendItemsMerged.selectAll('.legend-line').data(d => [d]);
    const legendLinesEnter = legendLines.enter().append('line').attr('class', 'legend-line');
    const legendLinesMerged = legendLinesEnter.merge(legendLines);
    
    legendLinesMerged
      .attr('x1', 0)
      .attr('y1', 10)
      .attr('x2', 30)
      .attr('y2', 10)
      .attr('stroke', d => d.color)
      .attr('stroke-width', 3);

    // 범례 텍스트
    const legendTexts = legendItemsMerged.selectAll('.legend-text').data(d => [d]);
    const legendTextsEnter = legendTexts.enter().append('text').attr('class', 'legend-text');
    const legendTextsMerged = legendTextsEnter.merge(legendTexts);
    
    legendTextsMerged
      .attr('x', 40)
      .attr('y', 14)
      .text(d => `${d.year}년`);


    // 불필요한 요소 제거
    yearLines.exit().remove();
    legendItems.exit().remove();

  }, [myForecast]);


  return (
    <div className="bg-accentGreen-light rounded-lg shadow-md m-8 p-6 flex flex-col justify-center items-center">
      <div className="text-center mb-5">
        <p className="text-2xl font-bold mb-2">월별 작물 매출액 예상 그래프</p>
      </div>
      <div className="chart-container">
        <svg ref={svgRef}></svg>
      </div> 
    </div>
  );
};

export default BenefitForecastGraph;
