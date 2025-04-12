import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as echarts from 'echarts';

@Component({
  selector: 'app-trip-planner',
  imports: [FormsModule],
  templateUrl: './trip-planner.component.html',
  styleUrls: ['./trip-planner.component.css']
})
export class TripPlannerComponent {
  startingPoint: string = '';
  endingPoint: string = '';
  lastEndingPoint: string = '';
  tripDetails: any[] = [];
  myChart:any;
  tempData: any = [{
    name: 'first-level', children: [
      {
        name: 'second-level', children: [
          {
            name: 'third-level', children: [
              {
                name: 'forth-level', children: []
              }
            ]
          },
          {
            name: 'third-level', children: [ ]
          }
        ]
      }
    ]
  }];
  tripOptions:any = {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    legend: {
      top: '2%',
      left: '3%',
      orient: 'vertical',
      data: [
        {
          name: 'tree1',
          icon: 'rectangle'
        },
      ],
      borderColor: '#c23531'
    },
    series: [
      {
        type: 'tree',
        name: 'tree1',
        data: this.tempData,
        top: '5%',
        left: '7%',
        bottom: '2%',
        right: '60%',
        symbolSize: 7,
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right'
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left'
          }
        },
      }
    ]
  };

  constructor() {}

  ngAfterViewInit() {
    const dom = document.getElementById('chart-container');
    this.myChart = echarts.init(dom, null, {
    renderer: 'canvas',
    useDirtyRect: false
    });
    this.myChart.setOption(this.tripOptions);
  }

  onSubmit(): void {
    if (this.tripDetails.length === 0) {
      this.tripDetails.push({ name: this.startingPoint, children: [{ name: this.endingPoint, children: [] }] });
      this.lastEndingPoint = this.endingPoint;
    } else {
      const parentNode = this.findNode(this.tripDetails, this.startingPoint);
  
      if (parentNode) {
        parentNode.children.push({ name: this.endingPoint, children: [] });
        this.lastEndingPoint = this.endingPoint;
      } else if (this.lastEndingPoint === this.startingPoint) {
        // Last ending point matches starting point → create new level
        const node = this.findNode(this.tripDetails, this.lastEndingPoint);
        if (node) {
          node.children.push({ name: this.endingPoint, children: [] });
          this.lastEndingPoint = this.endingPoint;
        }
      } else {
        console.error(`Starting point '${this.startingPoint}' not found`);
      }
    }
  }

  findNode(nodes: any[], name: string): any {
    for (let node of nodes) {
      if (node.name.toLowerCase() === name.toLowerCase()) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const found = this.findNode(node.children, name);
        if (found) return found;
      }
    }
    return null;
  }

  visualizeTrip(): void {
    this.tripOptions.series[0].data = this.tripDetails;
    this.myChart.setOption(this.tripOptions);
  }

  clearTrip(): void {
    this.tripDetails = [];
    this.startingPoint = '';
    this.endingPoint = '';
    this.lastEndingPoint = '';
    this.tripOptions.series[0].data = this.tempData;
    this.myChart.setOption(this.tripOptions);
  }
  
}
