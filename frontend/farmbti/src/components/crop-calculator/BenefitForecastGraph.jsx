import { useEffect, useRef } from "react";
import * as d3 from "d3";

const BenefitForecastGraph = ({ cropsName, myForecast, pastPrice, isInModal = false }) => {
  const svgRef = useRef();
  const containerRef = useRef(); // 툴팁 컨테이너를 위한 ref 추가

  // D3와 React 통합을 위한 useEffect
  useEffect(() => {
    if (!myForecast || !pastPrice || !svgRef.current) return;

    // 두 데이터셋 모두 가져오기
    const forecastData = myForecast.monthly_data;
    const pastData = pastPrice.past_data;

    // 모든 데이터 통합
    const allData = [...forecastData, ...pastData];

    // svg 컨테이너 설정
    const svg = d3.select(svgRef.current);
    // viewBox 사용으로 변경
    svg
      .attr("viewBox", "0 0 900 500")
      .attr("preserveAspectRatio", "xMidYMid meet");

    const width = 900;
    const height = 500;
    const margin = { top: 30, right: 150, bottom: 60, left: 80 }; // 범례를 위한 오른쪽 여백 확대
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // 그래프 영역 초기화
    svg.selectAll("*").remove();

    // 메인 그룹 생성
    const g = svg
      .append("g")
      .attr("class", "chart-group")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // 데이터 변환을 위한 연도 추출
    const years = [...new Set(allData.map((d) => d.year))].sort();

    // 색상 스케일 설정 - 더 좋은 대비를 위한 컬러 팔레트
    const colorScale = d3
      .scaleOrdinal()
      .domain(years)
      .range(["#2196F3", "#FF5722", "#4CAF50", "#9C27B0", "#FFC107"]);

    // 최대 가격 데이터를 찾아 y축 스케일 설정
    const maxPrice = d3.max(allData, (d) => d.price_forecast) * 1.1;

    // x축 스케일 (월)
    const xScale = d3.scaleLinear().domain([1, 12]).range([0, innerWidth]);

    // y축 스케일 (가격)
    const yScale = d3
      .scaleLinear()
      .domain([0, maxPrice])
      .range([innerHeight, 0]);

    // 격자선 그리기 (x축)
    g.selectAll(".x-grid")
      .data(d3.range(1, 13))
      .enter()
      .append("line")
      .attr("class", "x-grid")
      .attr("x1", (d) => xScale(d))
      .attr("y1", 0)
      .attr("x2", (d) => xScale(d))
      .attr("y2", innerHeight)
      .attr("stroke", "#e0e0e0")
      .attr("stroke-dasharray", "3,3");

    // 격자선 그리기 (y축)
    g.selectAll(".y-grid")
      .data(yScale.ticks(10))
      .enter()
      .append("line")
      .attr("class", "y-grid")
      .attr("x1", 0)
      .attr("y1", (d) => yScale(d))
      .attr("x2", innerWidth)
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#e0e0e0")
      .attr("stroke-dasharray", "3,3");

    // 선 생성기
    const lineGenerator = d3
      .line()
      .x((d) => xScale(d.month))
      .y((d) => yScale(d.price_forecast))
      .curve(d3.curveMonotoneX);

    // x축 그리기
    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickFormat((d) => `${d}월`)
          .tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
      );

    // x축 라벨
    g.append("text")
      .attr("class", "x-label")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 40)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text("월");

    // y축 그리기
    g.append("g")
      .attr("class", "y-axis")
      .call(
        d3
          .axisLeft(yScale)
          .ticks(10)
          .tickFormat((d) => `${Math.round(d).toLocaleString()}원`)
      );

    // y축 라벨
    g.append("text")
      .attr("class", "y-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -60)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text("예상 가격 (원)");

    // 데이터를 연도별로 그룹화
    const yearlyData = years.map((year) => {
      let dataSource;

      // 2025년 데이터는 forecast에서, 그 외는 past 데이터에서
      if (year === 2025) {
        dataSource = forecastData.filter((d) => d.year === year);
      } else {
        dataSource = pastData.filter((d) => d.year === year);
      }

      return {
        year,
        forecast: year === 2025, // 2025년은 예측 데이터임을 표시
        color: colorScale(year),
        values: dataSource.sort((a, b) => a.month - b.month),
      };
    });

    // 각 연도별 선 그래프 그리기
    yearlyData.forEach((yearData) => {
      const yearGroup = g
        .append("g")
        .attr("class", "year-line")
        .attr("data-year", yearData.year);

      // 선 그리기 (예측 데이터는 점선으로 표현)
      yearGroup
        .append("path")
        .attr("class", "line")
        .attr("d", lineGenerator(yearData.values))
        .attr("fill", "none")
        .attr("stroke", yearData.color)
        .attr("stroke-width", 3)
        .attr("stroke-dasharray", yearData.forecast ? "5,5" : "0") // 예측 데이터는 점선
        .attr("opacity", 0)
        .transition()
        .duration(1000)
        .attr("opacity", 1);

      // 데이터 포인트 그리기
      yearData.values.forEach((point, i) => {
        yearGroup
          .append("circle")
          .attr("class", "data-point")
          .attr("cx", xScale(point.month))
          .attr("cy", yScale(point.price_forecast))
          .attr("r", 5)
          .attr("fill", yearData.color)
          .attr("opacity", 0)
          .transition()
          .duration(700)
          .delay(i * 50) // 순차적 애니메이션
          .attr("opacity", 1);
      });
    });

    // 툴팁 생성 - body 대신 containerRef나 dialog를 사용
    // 기존 툴팁 제거 (중복 방지)
    d3.selectAll(".price-tooltip").remove();

    const tooltipContainer = d3.select(containerRef.current);
    // 새 툴팁 생성
    const tooltip = tooltipContainer
      .append("div")
      .attr("class", "price-tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "rgba(255, 255, 255, 0.9)")
      .style("border", "1px solid #ddd")
      .style("border-radius", "4px")
      .style("padding", "10px")
      .style("box-shadow", "0 4px 8px rgba(0,0,0,0.1)")
      .style("pointer-events", "none")
      .style("font-size", "12px")
      .style("z-index", 1000);

    // 모든 데이터 포인트에 마우스 이벤트 추가
    g.selectAll(".data-point")
      .on("mouseover", function (event, d) {
        const circle = d3.select(this);
        const cx = parseFloat(circle.attr("cx"));
        const month = Math.round(xScale.invert(cx));
        const year = parseInt(this.parentNode.getAttribute("data-year"));

        // 원본 데이터 찾기
        const pointData = allData.find(
          (item) => item.year === year && item.month === month
        );

        if (!pointData) return;

        const isForecast = pointData.year === 2025;

        circle.transition().duration(200).attr("r", 8);

        tooltip.transition().duration(200).style("opacity", 0.9);

        // 위치 계산 및 적용 - 모두 컨테이너 기준으로 변경
        const containerRect = containerRef.current.getBoundingClientRect();
        const leftPos = event.clientX - containerRect.left + 10 + "px";
        const topPos = event.clientY - containerRect.top - 28 + "px";

        tooltip
          .html(
            `
            <div style="font-weight: bold; margin-bottom: 5px; color: ${colorScale(
              pointData.year
            )}">
              ${pointData.year}년 ${pointData.month}월
              ${isForecast ? "(예측)" : "(실제)"}
            </div>
            <div>가격: ${Math.round(
              pointData.price_forecast
            ).toLocaleString()}원</div>
          `
          )
          .style("left", leftPos)
          .style("top", topPos);
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(200).attr("r", 5);

        tooltip.transition().duration(300).style("opacity", 0);
      });

    // 범례 그리기
    const legend = g
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${innerWidth + 20}, 0)`);

    // 연도별 범례
    yearlyData.forEach((yearData, i) => {
      const legendItem = legend
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", `translate(0, ${i * 30})`);

      // 범례 색상 선
      legendItem
        .append("line")
        .attr("x1", 0)
        .attr("y1", 10)
        .attr("x2", 30)
        .attr("y2", 10)
        .attr("stroke", yearData.color)
        .attr("stroke-width", 3)
        .attr("stroke-dasharray", yearData.forecast ? "5,5" : "0");

      // 범례 텍스트
      legendItem
        .append("text")
        .attr("x", 40)
        .attr("y", 14)
        .style("font-size", "12px")
        .text(`${yearData.year}년 ${yearData.forecast ? "(예측)" : ""}`);
    });

    // 그래프 제목 추가
    g.append("text")
      .attr("class", "chart-title")
      .attr("x", innerWidth / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(`${cropsName}의 월별 1Kg당 작물 매출액 추이 및 예측`);

    // 컴포넌트가 언마운트될 때 툴팁 제거
    return () => {
      d3.selectAll(".price-tooltip").remove();
    };
  }, [myForecast, pastPrice, isInModal]);

  return (
    <div
      ref={containerRef}
      className="bg-gray-50 rounded-lg shadow-lg m-8 p-6 flex flex-col justify-center items-center relative"
    >
      <div className="w-full overflow-x-auto">
        <svg
          ref={svgRef}
          className="w-full"
          style={{ maxHeight: "500px" }}
        ></svg>
      </div>
      <div className="text-center mt-4 text-sm text-gray-600">
        <p>
          * 2023-2024년 데이터는 실제 가격, 2025년 데이터는 예측 가격입니다.
        </p>
      </div>
    </div>
  );
};

export default BenefitForecastGraph;
