// shared.module.ts (optional)
import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  imports: [NgxEchartsModule.forRoot({ echarts: () => import('echarts') })],
  exports: [NgxEchartsModule] // Export the module itself for use in other modules
})
export class SharedModule {}
