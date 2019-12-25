import Chart from 'chart.js';

const DrawTotals = (chart: Chart): void => {
  let width: number = chart.width;
  let height: number = chart.height;
  let ctx: CanvasRenderingContext2D = chart.ctx;

  ctx.restore();
  let fontSize: string = (height / 114).toFixed(2);
  ctx.font = fontSize + 'em Source Sans Pro';
  ctx.textBaseline = 'middle';

  // @ts-ignore
  let text: string = chart.config.centerText.text;
  let textX: number = Math.round((width - ctx.measureText(text).width) / 2);
  let textY: number = height / 2 - 10;

  ctx.fillText(text, textX, textY);
  ctx.save();
};

Chart.Chart.pluginService.register({
  beforeDraw(chart) {
    // @ts-ignore
    if (chart.config.centerText) {
      DrawTotals(chart);
    }
  }
});
