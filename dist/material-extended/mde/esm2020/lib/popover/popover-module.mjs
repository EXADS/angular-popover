import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { MdePopover } from './popover';
import { MdePopoverTrigger } from './popover-trigger';
import { MdePopoverTarget } from './popover-target';
import { A11yModule } from '@angular/cdk/a11y';
import * as i0 from "@angular/core";
export class MdePopoverModule {
}
MdePopoverModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: MdePopoverModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MdePopoverModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: MdePopoverModule, declarations: [MdePopover, MdePopoverTrigger, MdePopoverTarget], imports: [OverlayModule,
        CommonModule,
        A11yModule], exports: [MdePopover, MdePopoverTrigger, MdePopoverTarget] });
MdePopoverModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: MdePopoverModule, imports: [[
            OverlayModule,
            CommonModule,
            A11yModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: MdePopoverModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        OverlayModule,
                        CommonModule,
                        A11yModule
                    ],
                    exports: [MdePopover, MdePopoverTrigger, MdePopoverTarget],
                    declarations: [MdePopover, MdePopoverTrigger, MdePopoverTarget],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tYXRlcmlhbC1leHRlbmRlZC9tZGUvc3JjL2xpYi9wb3BvdmVyL3BvcG92ZXItbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRS9DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUVyRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQzs7QUFXL0MsTUFBTSxPQUFPLGdCQUFnQjs7OEdBQWhCLGdCQUFnQjsrR0FBaEIsZ0JBQWdCLGlCQUZaLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxnQkFBZ0IsYUFMNUQsYUFBYTtRQUNiLFlBQVk7UUFDWixVQUFVLGFBRUYsVUFBVSxFQUFFLGlCQUFpQixFQUFFLGdCQUFnQjsrR0FHOUMsZ0JBQWdCLFlBUmxCO1lBQ1AsYUFBYTtZQUNiLFlBQVk7WUFDWixVQUFVO1NBQ1g7NEZBSVUsZ0JBQWdCO2tCQVQ1QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRTt3QkFDUCxhQUFhO3dCQUNiLFlBQVk7d0JBQ1osVUFBVTtxQkFDWDtvQkFDRCxPQUFPLEVBQUUsQ0FBQyxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsZ0JBQWdCLENBQUM7b0JBQzFELFlBQVksRUFBRSxDQUFDLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxnQkFBZ0IsQ0FBQztpQkFDaEUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgT3ZlcmxheU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcblxuaW1wb3J0IHsgTWRlUG9wb3ZlciB9IGZyb20gJy4vcG9wb3Zlcic7XG5pbXBvcnQgeyBNZGVQb3BvdmVyVHJpZ2dlciB9IGZyb20gJy4vcG9wb3Zlci10cmlnZ2VyJztcbmltcG9ydCB7IE1kZVBvcG92ZXJUYXJnZXQgfSBmcm9tICcuL3BvcG92ZXItdGFyZ2V0JztcbmltcG9ydCB7IEExMXlNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBPdmVybGF5TW9kdWxlLFxuICAgIENvbW1vbk1vZHVsZSxcbiAgICBBMTF5TW9kdWxlXG4gIF0sXG4gIGV4cG9ydHM6IFtNZGVQb3BvdmVyLCBNZGVQb3BvdmVyVHJpZ2dlciwgTWRlUG9wb3ZlclRhcmdldF0sXG4gIGRlY2xhcmF0aW9uczogW01kZVBvcG92ZXIsIE1kZVBvcG92ZXJUcmlnZ2VyLCBNZGVQb3BvdmVyVGFyZ2V0XSxcbn0pXG5leHBvcnQgY2xhc3MgTWRlUG9wb3Zlck1vZHVsZSB7fVxuIl19