import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild, ViewEncapsulation, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE } from '@angular/cdk/keycodes';
import { throwMdePopoverInvalidPositionX, throwMdePopoverInvalidPositionY } from './popover-errors';
import { transformPopover } from './popover-animations';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/cdk/a11y";
export class MdePopover {
    constructor(_elementRef, zone) {
        this._elementRef = _elementRef;
        this.zone = zone;
        this.role = 'dialog';
        /** Settings for popover, view setters and getters for more detail */
        this._positionX = 'after';
        this._positionY = 'below';
        this._triggerEvent = 'hover';
        this._scrollStrategy = 'reposition';
        this._enterDelay = 200;
        this._leaveDelay = 200;
        this._overlapTrigger = true;
        this._disableAnimation = false;
        this._targetOffsetX = 0;
        this._targetOffsetY = 0;
        this._arrowOffsetX = 20;
        this._arrowWidth = 8;
        this._arrowColor = 'rgba(0, 0, 0, 0.12)';
        this._closeOnClick = true;
        this._focusTrapEnabled = true;
        this._focusTrapAutoCaptureEnabled = true;
        /** Config object to be passed into the popover's ngClass */
        this._classList = {};
        // TODO: Write comment description
        /** */
        this.containerPositioning = false;
        /** Closing disabled on popover */
        this.closeDisabled = false;
        /** Emits the current animation state whenever it changes. */
        this._onAnimationStateChange = new EventEmitter();
        /** Event emitted when the popover is closed. */
        this.close = new EventEmitter();
        this.setPositionClasses();
    }
    /** Position of the popover in the X axis. */
    get positionX() { return this._positionX; }
    set positionX(value) {
        if (value !== 'before' && value !== 'after') {
            throwMdePopoverInvalidPositionX();
        }
        this._positionX = value;
        this.setPositionClasses();
    }
    /** Position of the popover in the Y axis. */
    get positionY() { return this._positionY; }
    set positionY(value) {
        if (value !== 'above' && value !== 'below') {
            throwMdePopoverInvalidPositionY();
        }
        this._positionY = value;
        this.setPositionClasses();
    }
    /** Popover trigger event */
    get triggerEvent() { return this._triggerEvent; }
    set triggerEvent(value) { this._triggerEvent = value; }
    /** Popover scroll strategy */
    get scrollStrategy() { return this._scrollStrategy; }
    set scrollStrategy(value) { this._scrollStrategy = value; }
    /** Popover enter delay */
    get enterDelay() { return this._enterDelay; }
    set enterDelay(value) { this._enterDelay = value; }
    /** Popover leave delay */
    get leaveDelay() { return this._leaveDelay; }
    set leaveDelay(value) { this._leaveDelay = value; }
    /** Popover overlap trigger */
    get overlapTrigger() { return this._overlapTrigger; }
    set overlapTrigger(value) { this._overlapTrigger = value; }
    /** Popover target offset x */
    get targetOffsetX() { return this._targetOffsetX; }
    set targetOffsetX(value) { this._targetOffsetX = value; }
    /** Popover target offset y */
    get targetOffsetY() { return this._targetOffsetY; }
    set targetOffsetY(value) { this._targetOffsetY = value; }
    /** Popover arrow offset x */
    get arrowOffsetX() { return this._arrowOffsetX; }
    set arrowOffsetX(value) { this._arrowOffsetX = value; }
    /** Popover arrow width */
    get arrowWidth() { return this._arrowWidth; }
    set arrowWidth(value) { this._arrowWidth = value; }
    /** Popover arrow color */
    get arrowColor() { return this._arrowColor; }
    set arrowColor(value) { this._arrowColor = value; }
    /**
     * Popover container close on click
     * default: true
     */
    get closeOnClick() { return this._closeOnClick; }
    set closeOnClick(value) { this._closeOnClick = coerceBooleanProperty(value); }
    /**
     * Disable animations of popover and all child elements
     * default: false
     */
    get disableAnimation() { return this._disableAnimation; }
    set disableAnimation(value) { this._disableAnimation = coerceBooleanProperty(value); }
    /**
     * Popover focus trap using cdkTrapFocus
     * default: true
     */
    get focusTrapEnabled() { return this._focusTrapEnabled; }
    set focusTrapEnabled(value) { this._focusTrapEnabled = coerceBooleanProperty(value); }
    /**
     * Popover focus trap auto capture using cdkTrapFocusAutoCapture
     * default: true
     */
    get focusTrapAutoCaptureEnabled() { return this._focusTrapAutoCaptureEnabled; }
    set focusTrapAutoCaptureEnabled(value) { this._focusTrapAutoCaptureEnabled = coerceBooleanProperty(value); }
    /**
     * This method takes classes set on the host md-popover element and applies them on the
     * popover template that displays in the overlay container.  Otherwise, it's difficult
     * to style the containing popover from outside the component.
     * @param classes list of class names
     */
    set panelClass(classes) {
        if (classes && classes.length) {
            this._classList = classes.split(' ').reduce((obj, className) => {
                obj[className] = true;
                return obj;
            }, {});
            this._elementRef.nativeElement.className = '';
            this.setPositionClasses();
        }
    }
    /**
     * This method takes classes set on the host md-popover element and applies them on the
     * popover template that displays in the overlay container.  Otherwise, it's difficult
     * to style the containing popover from outside the component.
     * @deprecated Use `panelClass` instead.
     */
    get classList() { return this.panelClass; }
    set classList(classes) { this.panelClass = classes; }
    ngOnDestroy() {
        this._emitCloseEvent();
        this.close.complete();
    }
    /** Handle a keyboard event from the popover, delegating to the appropriate action. */
    _handleKeydown(event) {
        switch (event.keyCode) {
            case ESCAPE:
                this._emitCloseEvent();
                return;
        }
    }
    /**
     * This emits a close event to which the trigger is subscribed. When emitted, the
     * trigger will close the popover.
     */
    _emitCloseEvent() {
        this.close.emit();
    }
    /** Close popover on click if closeOnClick is true */
    onClick() {
        if (this.closeOnClick) {
            this._emitCloseEvent();
        }
    }
    /**
     * TODO: Refactor when @angular/cdk includes feature I mentioned on github see link below.
     * https://github.com/angular/material2/pull/5493#issuecomment-313085323
     */
    /** Disables close of popover when leaving trigger element and mouse over the popover */
    onMouseOver() {
        if (this.triggerEvent === 'hover') {
            this.closeDisabled = true;
        }
    }
    /** Enables close of popover when mouse leaving popover element */
    onMouseLeave() {
        if (this.triggerEvent === 'hover') {
            this.closeDisabled = false;
            this._emitCloseEvent();
        }
    }
    // TODO: Refactor how styles are set and updated on the component, use best practices.
    // TODO: If arrow left and right positioning is requested, see if flex direction can be used to work with order.
    /** Sets the current styles for the popover to allow for dynamically changing settings */
    setCurrentStyles() {
        // TODO: See if arrow position can be calculated automatically and allow override.
        // TODO: See if flex order is a better alternative to position arrow top or bottom.
        this.popoverArrowStyles = {
            'right': this.positionX === 'before' ? (this.arrowOffsetX - this.arrowWidth) + 'px' : '',
            'left': this.positionX === 'after' ? (this.arrowOffsetX - this.arrowWidth) + 'px' : '',
            'border-top': this.positionY === 'below' ?
                this.arrowWidth + 'px solid ' + this.arrowColor : '0px solid transparent',
            'border-right': 'undefined' === undefined ?
                this.arrowWidth + 'px solid ' + this.arrowColor :
                this.arrowWidth + 'px solid transparent',
            'border-bottom': this.positionY === 'above' ?
                this.arrowWidth + 'px solid ' + this.arrowColor :
                this.arrowWidth + 'px solid transparent',
            'border-left': 'undefined' === undefined ?
                this.arrowWidth + 'px solid ' + this.arrowColor :
                this.arrowWidth + 'px solid transparent',
        };
        // TODO: Remove if flex order is added.
        this.popoverContentStyles = {
            'padding-top': this.overlapTrigger === true ? '0px' : this.arrowWidth + 'px',
            'padding-bottom': this.overlapTrigger === true ? '0px' : (this.arrowWidth) + 'px',
            'margin-top': this.overlapTrigger === false && this.positionY === 'below' && this.containerPositioning === false ?
                -(this.arrowWidth * 2) + 'px' : '0px'
        };
    }
    /**
     * It's necessary to set position-based classes to ensure the popover panel animation
     * folds out from the correct direction.
     */
    setPositionClasses(posX = this.positionX, posY = this.positionY) {
        this._classList['mde-popover-before'] = posX === 'before';
        this._classList['mde-popover-after'] = posX === 'after';
        this._classList['mde-popover-above'] = posY === 'above';
        this._classList['mde-popover-below'] = posY === 'below';
    }
}
MdePopover.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: MdePopover, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
MdePopover.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.11", type: MdePopover, selector: "mde-popover", inputs: { positionX: ["mdePopoverPositionX", "positionX"], positionY: ["mdePopoverPositionY", "positionY"], triggerEvent: ["mdePopoverTriggerOn", "triggerEvent"], scrollStrategy: ["mdePopoverScrollStrategy", "scrollStrategy"], enterDelay: ["mdePopoverEnterDelay", "enterDelay"], leaveDelay: ["mdePopoverLeaveDelay", "leaveDelay"], overlapTrigger: ["mdePopoverOverlapTrigger", "overlapTrigger"], targetOffsetX: ["mdePopoverOffsetX", "targetOffsetX"], targetOffsetY: ["mdePopoverOffsetY", "targetOffsetY"], arrowOffsetX: ["mdePopoverArrowOffsetX", "arrowOffsetX"], arrowWidth: ["mdePopoverArrowWidth", "arrowWidth"], arrowColor: ["mdePopoverArrowColor", "arrowColor"], closeOnClick: ["mdePopoverCloseOnClick", "closeOnClick"], disableAnimation: ["mdePopoverDisableAnimation", "disableAnimation"], focusTrapEnabled: ["mdeFocusTrapEnabled", "focusTrapEnabled"], focusTrapAutoCaptureEnabled: ["mdeFocusTrapAutoCaptureEnabled", "focusTrapAutoCaptureEnabled"], panelClass: ["class", "panelClass"], classList: "classList" }, outputs: { close: "close" }, host: { properties: { "attr.role": "this.role" } }, viewQueries: [{ propertyName: "templateRef", first: true, predicate: TemplateRef, descendants: true }], exportAs: ["mdePopover"], ngImport: i0, template: "<ng-template>\n  <div class=\"mde-popover-panel\" role=\"dialog\" [class.mde-popover-overlap]=\"overlapTrigger\"\n       [ngClass]=\"_classList\" [ngStyle]=\"popoverPanelStyles\" (keydown)=\"_handleKeydown($event)\"\n       (click)=\"onClick()\" (mouseover)=\"onMouseOver()\" (mouseleave)=\"onMouseLeave()\" [@.disabled]=\"disableAnimation\"\n       [@transformPopover]=\"'enter'\">\n    <div class=\"mde-popover-direction-arrow\" [ngStyle]=\"popoverArrowStyles\" *ngIf=\"!overlapTrigger\"></div>\n    <div class=\"mde-popover-content\" [ngStyle]=\"popoverContentStyles\" [cdkTrapFocus]=\"focusTrapEnabled\" [cdkTrapFocusAutoCapture]=\"focusTrapAutoCaptureEnabled\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</ng-template>\n", styles: [".mde-popover-panel{display:flex;flex-direction:column;max-height:calc(100vh + 48px)}.mde-popover-ripple{position:absolute;top:0;left:0;bottom:0;right:0}.mde-popover-below .mde-popover-direction-arrow{position:absolute;bottom:0;width:0;height:0;border-bottom-width:0!important;z-index:99999}.mde-popover-above .mde-popover-direction-arrow{position:absolute;top:0px;width:0;height:0;border-top-width:0!important;z-index:99999}.mde-popover-after .mde-popover-direction-arrow{left:20px}.mde-popover-before .mde-popover-direction-arrow{right:20px}\n"], directives: [{ type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i2.CdkTrapFocus, selector: "[cdkTrapFocus]", inputs: ["cdkTrapFocus", "cdkTrapFocusAutoCapture"], exportAs: ["cdkTrapFocus"] }], animations: [
        transformPopover
    ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: MdePopover, decorators: [{
            type: Component,
            args: [{ selector: 'mde-popover', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, animations: [
                        transformPopover
                    ], exportAs: 'mdePopover', template: "<ng-template>\n  <div class=\"mde-popover-panel\" role=\"dialog\" [class.mde-popover-overlap]=\"overlapTrigger\"\n       [ngClass]=\"_classList\" [ngStyle]=\"popoverPanelStyles\" (keydown)=\"_handleKeydown($event)\"\n       (click)=\"onClick()\" (mouseover)=\"onMouseOver()\" (mouseleave)=\"onMouseLeave()\" [@.disabled]=\"disableAnimation\"\n       [@transformPopover]=\"'enter'\">\n    <div class=\"mde-popover-direction-arrow\" [ngStyle]=\"popoverArrowStyles\" *ngIf=\"!overlapTrigger\"></div>\n    <div class=\"mde-popover-content\" [ngStyle]=\"popoverContentStyles\" [cdkTrapFocus]=\"focusTrapEnabled\" [cdkTrapFocusAutoCapture]=\"focusTrapAutoCaptureEnabled\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</ng-template>\n", styles: [".mde-popover-panel{display:flex;flex-direction:column;max-height:calc(100vh + 48px)}.mde-popover-ripple{position:absolute;top:0;left:0;bottom:0;right:0}.mde-popover-below .mde-popover-direction-arrow{position:absolute;bottom:0;width:0;height:0;border-bottom-width:0!important;z-index:99999}.mde-popover-above .mde-popover-direction-arrow{position:absolute;top:0px;width:0;height:0;border-top-width:0!important;z-index:99999}.mde-popover-after .mde-popover-direction-arrow{left:20px}.mde-popover-before .mde-popover-direction-arrow{right:20px}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { role: [{
                type: HostBinding,
                args: ['attr.role']
            }], positionX: [{
                type: Input,
                args: ['mdePopoverPositionX']
            }], positionY: [{
                type: Input,
                args: ['mdePopoverPositionY']
            }], triggerEvent: [{
                type: Input,
                args: ['mdePopoverTriggerOn']
            }], scrollStrategy: [{
                type: Input,
                args: ['mdePopoverScrollStrategy']
            }], enterDelay: [{
                type: Input,
                args: ['mdePopoverEnterDelay']
            }], leaveDelay: [{
                type: Input,
                args: ['mdePopoverLeaveDelay']
            }], overlapTrigger: [{
                type: Input,
                args: ['mdePopoverOverlapTrigger']
            }], targetOffsetX: [{
                type: Input,
                args: ['mdePopoverOffsetX']
            }], targetOffsetY: [{
                type: Input,
                args: ['mdePopoverOffsetY']
            }], arrowOffsetX: [{
                type: Input,
                args: ['mdePopoverArrowOffsetX']
            }], arrowWidth: [{
                type: Input,
                args: ['mdePopoverArrowWidth']
            }], arrowColor: [{
                type: Input,
                args: ['mdePopoverArrowColor']
            }], closeOnClick: [{
                type: Input,
                args: ['mdePopoverCloseOnClick']
            }], disableAnimation: [{
                type: Input,
                args: ['mdePopoverDisableAnimation']
            }], focusTrapEnabled: [{
                type: Input,
                args: ['mdeFocusTrapEnabled']
            }], focusTrapAutoCaptureEnabled: [{
                type: Input,
                args: ['mdeFocusTrapAutoCaptureEnabled']
            }], panelClass: [{
                type: Input,
                args: ['class']
            }], classList: [{
                type: Input
            }], close: [{
                type: Output
            }], templateRef: [{
                type: ViewChild,
                args: [TemplateRef]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21hdGVyaWFsLWV4dGVuZGVkL21kZS9zcmMvbGliL3BvcG92ZXIvcG9wb3Zlci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21hdGVyaWFsLWV4dGVuZGVkL21kZS9zcmMvbGliL3BvcG92ZXIvcG9wb3Zlci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsWUFBWSxFQUNaLEtBQUssRUFFTCxNQUFNLEVBQ04sV0FBVyxFQUNYLFNBQVMsRUFDVCxpQkFBaUIsRUFFakIsdUJBQXVCLEVBQ3ZCLFdBQVcsRUFFWixNQUFNLGVBQWUsQ0FBQztBQUl2QixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFHL0MsT0FBTyxFQUFFLCtCQUErQixFQUFFLCtCQUErQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFcEcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7Ozs7QUFheEQsTUFBTSxPQUFPLFVBQVU7SUF1THJCLFlBQW9CLFdBQXVCLEVBQVMsSUFBWTtRQUE1QyxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUFTLFNBQUksR0FBSixJQUFJLENBQVE7UUFyTHRDLFNBQUksR0FBRyxRQUFRLENBQUM7UUFFMUMscUVBQXFFO1FBQzdELGVBQVUsR0FBd0IsT0FBTyxDQUFDO1FBQzFDLGVBQVUsR0FBd0IsT0FBTyxDQUFDO1FBQzFDLGtCQUFhLEdBQTJCLE9BQU8sQ0FBQztRQUNoRCxvQkFBZSxHQUE2QixZQUFZLENBQUM7UUFDekQsZ0JBQVcsR0FBRyxHQUFHLENBQUM7UUFDbEIsZ0JBQVcsR0FBRyxHQUFHLENBQUM7UUFDbEIsb0JBQWUsR0FBRyxJQUFJLENBQUM7UUFDdkIs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Szt1QkFBQyxxQkFBcUI7Z0JBWXhCLFlBQVk7c0JBRGYsS0FBSzt1QkFBQyxxQkFBcUI7Z0JBTXhCLGNBQWM7c0JBRGpCLEtBQUs7dUJBQUMsMEJBQTBCO2dCQU03QixVQUFVO3NCQURiLEtBQUs7dUJBQUMsc0JBQXNCO2dCQU16QixVQUFVO3NCQURiLEtBQUs7dUJBQUMsc0JBQXNCO2dCQU16QixjQUFjO3NCQURqQixLQUFLO3VCQUFDLDBCQUEwQjtnQkFNN0IsYUFBYTtzQkFEaEIsS0FBSzt1QkFBQyxtQkFBbUI7Z0JBTXRCLGFBQWE7c0JBRGhCLEtBQUs7dUJBQUMsbUJBQW1CO2dCQU10QixZQUFZO3NCQURmLEtBQUs7dUJBQUMsd0JBQXdCO2dCQU0zQixVQUFVO3NCQURiLEtBQUs7dUJBQUMsc0JBQXNCO2dCQU16QixVQUFVO3NCQURiLEtBQUs7dUJBQUMsc0JBQXNCO2dCQVN6QixZQUFZO3NCQURmLEtBQUs7dUJBQUMsd0JBQXdCO2dCQVMzQixnQkFBZ0I7c0JBRG5CLEtBQUs7dUJBQUMsNEJBQTRCO2dCQVMvQixnQkFBZ0I7c0JBRG5CLEtBQUs7dUJBQUMscUJBQXFCO2dCQVN4QiwyQkFBMkI7c0JBRDlCLEtBQUs7dUJBQUMsZ0NBQWdDO2dCQVduQyxVQUFVO3NCQURiLEtBQUs7dUJBQUMsT0FBTztnQkFvQlYsU0FBUztzQkFEWixLQUFLO2dCQUtJLEtBQUs7c0JBQWQsTUFBTTtnQkFFaUIsV0FBVztzQkFBbEMsU0FBUzt1QkFBQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE91dHB1dCxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEVsZW1lbnRSZWYsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBIb3N0QmluZGluZyxcbiAgTmdab25lXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBBbmltYXRpb25FdmVudCB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG5pbXBvcnQgeyBjb2VyY2VCb29sZWFuUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHsgRVNDQVBFIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcblxuaW1wb3J0IHsgTWRlUG9wb3ZlclBvc2l0aW9uWCwgTWRlUG9wb3ZlclBvc2l0aW9uWSwgTWRlUG9wb3ZlclRyaWdnZXJFdmVudCwgTWRlUG9wb3ZlclNjcm9sbFN0cmF0ZWd5IH0gZnJvbSAnLi9wb3BvdmVyLXR5cGVzJztcbmltcG9ydCB7IHRocm93TWRlUG9wb3ZlckludmFsaWRQb3NpdGlvblgsIHRocm93TWRlUG9wb3ZlckludmFsaWRQb3NpdGlvblkgfSBmcm9tICcuL3BvcG92ZXItZXJyb3JzJztcbmltcG9ydCB7IE1kZVBvcG92ZXJQYW5lbCB9IGZyb20gJy4vcG9wb3Zlci1pbnRlcmZhY2VzJztcbmltcG9ydCB7IHRyYW5zZm9ybVBvcG92ZXIgfSBmcm9tICcuL3BvcG92ZXItYW5pbWF0aW9ucyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21kZS1wb3BvdmVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3BvcG92ZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3BvcG92ZXIuc2NzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgYW5pbWF0aW9uczogW1xuICAgIHRyYW5zZm9ybVBvcG92ZXJcbiAgXSxcbiAgZXhwb3J0QXM6ICdtZGVQb3BvdmVyJ1xufSlcbmV4cG9ydCBjbGFzcyBNZGVQb3BvdmVyIGltcGxlbWVudHMgTWRlUG9wb3ZlclBhbmVsLCBPbkRlc3Ryb3kgeyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lOmNvbXBvbmVudC1jbGFzcy1zdWZmaXhcblxuICBASG9zdEJpbmRpbmcoJ2F0dHIucm9sZScpIHJvbGUgPSAnZGlhbG9nJztcblxuICAvKiogU2V0dGluZ3MgZm9yIHBvcG92ZXIsIHZpZXcgc2V0dGVycyBhbmQgZ2V0dGVycyBmb3IgbW9yZSBkZXRhaWwgKi9cbiAgcHJpdmF0ZSBfcG9zaXRpb25YOiBNZGVQb3BvdmVyUG9zaXRpb25YID0gJ2FmdGVyJztcbiAgcHJpdmF0ZSBfcG9zaXRpb25ZOiBNZGVQb3BvdmVyUG9zaXRpb25ZID0gJ2JlbG93JztcbiAgcHJpdmF0ZSBfdHJpZ2dlckV2ZW50OiBNZGVQb3BvdmVyVHJpZ2dlckV2ZW50ID0gJ2hvdmVyJztcbiAgcHJpdmF0ZSBfc2Nyb2xsU3RyYXRlZ3k6IE1kZVBvcG92ZXJTY3JvbGxTdHJhdGVneSA9ICdyZXBvc2l0aW9uJztcbiAgcHJpdmF0ZSBfZW50ZXJEZWxheSA9IDIwMDtcbiAgcHJpdmF0ZSBfbGVhdmVEZWxheSA9IDIwMDtcbiAgcHJpdmF0ZSBfb3ZlcmxhcFRyaWdnZXIgPSB0cnVlO1xuICBwcml2YXRlIF9kaXNhYmxlQW5pbWF0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgX3RhcmdldE9mZnNldFggPSAwO1xuICBwcml2YXRlIF90YXJnZXRPZmZzZXRZID0gMDtcbiAgcHJpdmF0ZSBfYXJyb3dPZmZzZXRYID0gMjA7XG4gIHByaXZhdGUgX2Fycm93V2lkdGggPSA4O1xuICBwcml2YXRlIF9hcnJvd0NvbG9yID0gJ3JnYmEoMCwgMCwgMCwgMC4xMiknO1xuICBwcml2YXRlIF9jbG9zZU9uQ2xpY2sgPSB0cnVlO1xuICBwcml2YXRlIF9mb2N1c1RyYXBFbmFibGVkID0gdHJ1ZTtcbiAgcHJpdmF0ZSBfZm9jdXNUcmFwQXV0b0NhcHR1cmVFbmFibGVkID0gdHJ1ZTtcblxuICAvKiogQ29uZmlnIG9iamVjdCB0byBiZSBwYXNzZWQgaW50byB0aGUgcG9wb3ZlcidzIG5nQ2xhc3MgKi9cbiAgX2NsYXNzTGlzdDoge1trZXk6IHN0cmluZ106IGJvb2xlYW59ID0ge307XG5cbiAgLy8gVE9ETzogV3JpdGUgY29tbWVudCBkZXNjcmlwdGlvblxuICAvKiogKi9cbiAgcHVibGljIGNvbnRhaW5lclBvc2l0aW9uaW5nID0gZmFsc2U7XG5cbiAgLyoqIENsb3NpbmcgZGlzYWJsZWQgb24gcG9wb3ZlciAqL1xuICBwdWJsaWMgY2xvc2VEaXNhYmxlZCA9IGZhbHNlO1xuXG4gIC8qKiBDb25maWcgb2JqZWN0IHRvIGJlIHBhc3NlZCBpbnRvIHRoZSBwb3BvdmVyJ3MgYXJyb3cgbmdTdHlsZSAqL1xuICBwdWJsaWMgcG9wb3ZlclBhbmVsU3R5bGVzOiB7fTtcblxuICAvKiogQ29uZmlnIG9iamVjdCB0byBiZSBwYXNzZWQgaW50byB0aGUgcG9wb3ZlcidzIGFycm93IG5nU3R5bGUgKi9cbiAgcHVibGljIHBvcG92ZXJBcnJvd1N0eWxlczoge307XG5cbiAgLyoqIENvbmZpZyBvYmplY3QgdG8gYmUgcGFzc2VkIGludG8gdGhlIHBvcG92ZXIncyBjb250ZW50IG5nU3R5bGUgKi9cbiAgcHVibGljIHBvcG92ZXJDb250ZW50U3R5bGVzOiB7fTtcblxuICAvKiogRW1pdHMgdGhlIGN1cnJlbnQgYW5pbWF0aW9uIHN0YXRlIHdoZW5ldmVyIGl0IGNoYW5nZXMuICovXG4gIF9vbkFuaW1hdGlvblN0YXRlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxBbmltYXRpb25FdmVudD4oKTtcblxuXG4gIC8qKiBQb3NpdGlvbiBvZiB0aGUgcG9wb3ZlciBpbiB0aGUgWCBheGlzLiAqL1xuICBASW5wdXQoJ21kZVBvcG92ZXJQb3NpdGlvblgnKVxuICBnZXQgcG9zaXRpb25YKCkgeyByZXR1cm4gdGhpcy5fcG9zaXRpb25YOyB9XG4gIHNldCBwb3NpdGlvblgodmFsdWU6IE1kZVBvcG92ZXJQb3NpdGlvblgpIHtcbiAgICBpZiAodmFsdWUgIT09ICdiZWZvcmUnICYmIHZhbHVlICE9PSAnYWZ0ZXInKSB7XG4gICAgICB0aHJvd01kZVBvcG92ZXJJbnZhbGlkUG9zaXRpb25YKCk7XG4gICAgfVxuICAgIHRoaXMuX3Bvc2l0aW9uWCA9IHZhbHVlO1xuICAgIHRoaXMuc2V0UG9zaXRpb25DbGFzc2VzKCk7XG4gIH1cblxuICAvKiogUG9zaXRpb24gb2YgdGhlIHBvcG92ZXIgaW4gdGhlIFkgYXhpcy4gKi9cbiAgQElucHV0KCdtZGVQb3BvdmVyUG9zaXRpb25ZJylcbiAgZ2V0IHBvc2l0aW9uWSgpIHsgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uWTsgfVxuICBzZXQgcG9zaXRpb25ZKHZhbHVlOiBNZGVQb3BvdmVyUG9zaXRpb25ZKSB7XG4gICAgaWYgKHZhbHVlICE9PSAnYWJvdmUnICYmIHZhbHVlICE9PSAnYmVsb3cnKSB7XG4gICAgICB0aHJvd01kZVBvcG92ZXJJbnZhbGlkUG9zaXRpb25ZKCk7XG4gICAgfVxuICAgIHRoaXMuX3Bvc2l0aW9uWSA9IHZhbHVlO1xuICAgIHRoaXMuc2V0UG9zaXRpb25DbGFzc2VzKCk7XG4gIH1cblxuICAvKiogUG9wb3ZlciB0cmlnZ2VyIGV2ZW50ICovXG4gIEBJbnB1dCgnbWRlUG9wb3ZlclRyaWdnZXJPbicpXG4gIGdldCB0cmlnZ2VyRXZlbnQoKTogTWRlUG9wb3ZlclRyaWdnZXJFdmVudCB7IHJldHVybiB0aGlzLl90cmlnZ2VyRXZlbnQ7IH1cbiAgc2V0IHRyaWdnZXJFdmVudCh2YWx1ZTogTWRlUG9wb3ZlclRyaWdnZXJFdmVudCkgeyB0aGlzLl90cmlnZ2VyRXZlbnQgPSB2YWx1ZTsgfVxuXG4gIC8qKiBQb3BvdmVyIHNjcm9sbCBzdHJhdGVneSAqL1xuICBASW5wdXQoJ21kZVBvcG92ZXJTY3JvbGxTdHJhdGVneScpXG4gIGdldCBzY3JvbGxTdHJhdGVneSgpOiBNZGVQb3BvdmVyU2Nyb2xsU3RyYXRlZ3kgeyByZXR1cm4gdGhpcy5fc2Nyb2xsU3RyYXRlZ3k7IH1cbiAgc2V0IHNjcm9sbFN0cmF0ZWd5KHZhbHVlOiBNZGVQb3BvdmVyU2Nyb2xsU3RyYXRlZ3kpIHsgdGhpcy5fc2Nyb2xsU3RyYXRlZ3kgPSB2YWx1ZTsgfVxuXG4gIC8qKiBQb3BvdmVyIGVudGVyIGRlbGF5ICovXG4gIEBJbnB1dCgnbWRlUG9wb3ZlckVudGVyRGVsYXknKVxuICBnZXQgZW50ZXJEZWxheSgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fZW50ZXJEZWxheTsgfVxuICBzZXQgZW50ZXJEZWxheSh2YWx1ZTogbnVtYmVyKSB7IHRoaXMuX2VudGVyRGVsYXkgPSB2YWx1ZTsgfVxuXG4gIC8qKiBQb3BvdmVyIGxlYXZlIGRlbGF5ICovXG4gIEBJbnB1dCgnbWRlUG9wb3ZlckxlYXZlRGVsYXknKVxuICBnZXQgbGVhdmVEZWxheSgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fbGVhdmVEZWxheTsgfVxuICBzZXQgbGVhdmVEZWxheSh2YWx1ZTogbnVtYmVyKSB7IHRoaXMuX2xlYXZlRGVsYXkgPSB2YWx1ZTsgfVxuXG4gIC8qKiBQb3BvdmVyIG92ZXJsYXAgdHJpZ2dlciAqL1xuICBASW5wdXQoJ21kZVBvcG92ZXJPdmVybGFwVHJpZ2dlcicpXG4gIGdldCBvdmVybGFwVHJpZ2dlcigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX292ZXJsYXBUcmlnZ2VyOyB9XG4gIHNldCBvdmVybGFwVHJpZ2dlcih2YWx1ZTogYm9vbGVhbikgeyB0aGlzLl9vdmVybGFwVHJpZ2dlciA9IHZhbHVlOyB9XG5cbiAgLyoqIFBvcG92ZXIgdGFyZ2V0IG9mZnNldCB4ICovXG4gIEBJbnB1dCgnbWRlUG9wb3Zlck9mZnNldFgnKVxuICBnZXQgdGFyZ2V0T2Zmc2V0WCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fdGFyZ2V0T2Zmc2V0WDsgfVxuICBzZXQgdGFyZ2V0T2Zmc2V0WCh2YWx1ZTogbnVtYmVyKSB7IHRoaXMuX3RhcmdldE9mZnNldFggPSB2YWx1ZTsgfVxuXG4gIC8qKiBQb3BvdmVyIHRhcmdldCBvZmZzZXQgeSAqL1xuICBASW5wdXQoJ21kZVBvcG92ZXJPZmZzZXRZJylcbiAgZ2V0IHRhcmdldE9mZnNldFkoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3RhcmdldE9mZnNldFk7IH1cbiAgc2V0IHRhcmdldE9mZnNldFkodmFsdWU6IG51bWJlcikgeyB0aGlzLl90YXJnZXRPZmZzZXRZID0gdmFsdWU7IH1cblxuICAvKiogUG9wb3ZlciBhcnJvdyBvZmZzZXQgeCAqL1xuICBASW5wdXQoJ21kZVBvcG92ZXJBcnJvd09mZnNldFgnKVxuICBnZXQgYXJyb3dPZmZzZXRYKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9hcnJvd09mZnNldFg7IH1cbiAgc2V0IGFycm93T2Zmc2V0WCh2YWx1ZTogbnVtYmVyKSB7IHRoaXMuX2Fycm93T2Zmc2V0WCA9IHZhbHVlOyB9XG5cbiAgLyoqIFBvcG92ZXIgYXJyb3cgd2lkdGggKi9cbiAgQElucHV0KCdtZGVQb3BvdmVyQXJyb3dXaWR0aCcpXG4gIGdldCBhcnJvd1dpZHRoKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9hcnJvd1dpZHRoOyB9XG4gIHNldCBhcnJvd1dpZHRoKHZhbHVlOiBudW1iZXIpIHsgdGhpcy5fYXJyb3dXaWR0aCA9IHZhbHVlOyB9XG5cbiAgLyoqIFBvcG92ZXIgYXJyb3cgY29sb3IgKi9cbiAgQElucHV0KCdtZGVQb3BvdmVyQXJyb3dDb2xvcicpXG4gIGdldCBhcnJvd0NvbG9yKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9hcnJvd0NvbG9yOyB9XG4gIHNldCBhcnJvd0NvbG9yKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy5fYXJyb3dDb2xvciA9IHZhbHVlOyB9XG5cbiAgLyoqXG4gICAqIFBvcG92ZXIgY29udGFpbmVyIGNsb3NlIG9uIGNsaWNrXG4gICAqIGRlZmF1bHQ6IHRydWVcbiAgICovXG4gIEBJbnB1dCgnbWRlUG9wb3ZlckNsb3NlT25DbGljaycpXG4gIGdldCBjbG9zZU9uQ2xpY2soKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9jbG9zZU9uQ2xpY2s7IH1cbiAgc2V0IGNsb3NlT25DbGljayh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLl9jbG9zZU9uQ2xpY2sgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG5cbiAgLyoqXG4gICAqIERpc2FibGUgYW5pbWF0aW9ucyBvZiBwb3BvdmVyIGFuZCBhbGwgY2hpbGQgZWxlbWVudHNcbiAgICogZGVmYXVsdDogZmFsc2VcbiAgICovXG4gIEBJbnB1dCgnbWRlUG9wb3ZlckRpc2FibGVBbmltYXRpb24nKVxuICBnZXQgZGlzYWJsZUFuaW1hdGlvbigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVBbmltYXRpb247IH1cbiAgc2V0IGRpc2FibGVBbmltYXRpb24odmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fZGlzYWJsZUFuaW1hdGlvbiA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7IH1cblxuICAvKipcbiAgICogUG9wb3ZlciBmb2N1cyB0cmFwIHVzaW5nIGNka1RyYXBGb2N1c1xuICAgKiBkZWZhdWx0OiB0cnVlXG4gICAqL1xuICBASW5wdXQoJ21kZUZvY3VzVHJhcEVuYWJsZWQnKVxuICBnZXQgZm9jdXNUcmFwRW5hYmxlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2ZvY3VzVHJhcEVuYWJsZWQ7IH1cbiAgc2V0IGZvY3VzVHJhcEVuYWJsZWQodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fZm9jdXNUcmFwRW5hYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7IH1cblxuICAvKipcbiAgICogUG9wb3ZlciBmb2N1cyB0cmFwIGF1dG8gY2FwdHVyZSB1c2luZyBjZGtUcmFwRm9jdXNBdXRvQ2FwdHVyZVxuICAgKiBkZWZhdWx0OiB0cnVlXG4gICAqL1xuICBASW5wdXQoJ21kZUZvY3VzVHJhcEF1dG9DYXB0dXJlRW5hYmxlZCcpXG4gIGdldCBmb2N1c1RyYXBBdXRvQ2FwdHVyZUVuYWJsZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9mb2N1c1RyYXBBdXRvQ2FwdHVyZUVuYWJsZWQ7IH1cbiAgc2V0IGZvY3VzVHJhcEF1dG9DYXB0dXJlRW5hYmxlZCh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLl9mb2N1c1RyYXBBdXRvQ2FwdHVyZUVuYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHRha2VzIGNsYXNzZXMgc2V0IG9uIHRoZSBob3N0IG1kLXBvcG92ZXIgZWxlbWVudCBhbmQgYXBwbGllcyB0aGVtIG9uIHRoZVxuICAgKiBwb3BvdmVyIHRlbXBsYXRlIHRoYXQgZGlzcGxheXMgaW4gdGhlIG92ZXJsYXkgY29udGFpbmVyLiAgT3RoZXJ3aXNlLCBpdCdzIGRpZmZpY3VsdFxuICAgKiB0byBzdHlsZSB0aGUgY29udGFpbmluZyBwb3BvdmVyIGZyb20gb3V0c2lkZSB0aGUgY29tcG9uZW50LlxuICAgKiBAcGFyYW0gY2xhc3NlcyBsaXN0IG9mIGNsYXNzIG5hbWVzXG4gICAqL1xuICBASW5wdXQoJ2NsYXNzJylcbiAgc2V0IHBhbmVsQ2xhc3MoY2xhc3Nlczogc3RyaW5nKSB7XG4gICAgaWYgKGNsYXNzZXMgJiYgY2xhc3Nlcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuX2NsYXNzTGlzdCA9IGNsYXNzZXMuc3BsaXQoJyAnKS5yZWR1Y2UoKG9iajogYW55LCBjbGFzc05hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICBvYmpbY2xhc3NOYW1lXSA9IHRydWU7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9LCB7fSk7XG5cbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc05hbWUgPSAnJztcbiAgICAgIHRoaXMuc2V0UG9zaXRpb25DbGFzc2VzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHRha2VzIGNsYXNzZXMgc2V0IG9uIHRoZSBob3N0IG1kLXBvcG92ZXIgZWxlbWVudCBhbmQgYXBwbGllcyB0aGVtIG9uIHRoZVxuICAgKiBwb3BvdmVyIHRlbXBsYXRlIHRoYXQgZGlzcGxheXMgaW4gdGhlIG92ZXJsYXkgY29udGFpbmVyLiAgT3RoZXJ3aXNlLCBpdCdzIGRpZmZpY3VsdFxuICAgKiB0byBzdHlsZSB0aGUgY29udGFpbmluZyBwb3BvdmVyIGZyb20gb3V0c2lkZSB0aGUgY29tcG9uZW50LlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYHBhbmVsQ2xhc3NgIGluc3RlYWQuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgY2xhc3NMaXN0KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnBhbmVsQ2xhc3M7IH1cbiAgc2V0IGNsYXNzTGlzdChjbGFzc2VzOiBzdHJpbmcpIHsgdGhpcy5wYW5lbENsYXNzID0gY2xhc3NlczsgfVxuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHBvcG92ZXIgaXMgY2xvc2VkLiAqL1xuICBAT3V0cHV0KCkgY2xvc2UgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgQFZpZXdDaGlsZChUZW1wbGF0ZVJlZikgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHVibGljIHpvbmU6IE5nWm9uZSkge1xuICAgIHRoaXMuc2V0UG9zaXRpb25DbGFzc2VzKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9lbWl0Q2xvc2VFdmVudCgpO1xuICAgIHRoaXMuY2xvc2UuY29tcGxldGUoKTtcbiAgfVxuXG5cbiAgLyoqIEhhbmRsZSBhIGtleWJvYXJkIGV2ZW50IGZyb20gdGhlIHBvcG92ZXIsIGRlbGVnYXRpbmcgdG8gdGhlIGFwcHJvcHJpYXRlIGFjdGlvbi4gKi9cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgIGNhc2UgRVNDQVBFOlxuICAgICAgICB0aGlzLl9lbWl0Q2xvc2VFdmVudCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgZW1pdHMgYSBjbG9zZSBldmVudCB0byB3aGljaCB0aGUgdHJpZ2dlciBpcyBzdWJzY3JpYmVkLiBXaGVuIGVtaXR0ZWQsIHRoZVxuICAgKiB0cmlnZ2VyIHdpbGwgY2xvc2UgdGhlIHBvcG92ZXIuXG4gICAqL1xuICBfZW1pdENsb3NlRXZlbnQoKTogdm9pZCB7XG4gICAgdGhpcy5jbG9zZS5lbWl0KCk7XG4gIH1cblxuICAvKiogQ2xvc2UgcG9wb3ZlciBvbiBjbGljayBpZiBjbG9zZU9uQ2xpY2sgaXMgdHJ1ZSAqL1xuICBvbkNsaWNrKCkge1xuICAgIGlmICh0aGlzLmNsb3NlT25DbGljaykge1xuICAgICAgdGhpcy5fZW1pdENsb3NlRXZlbnQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVE9ETzogUmVmYWN0b3Igd2hlbiBAYW5ndWxhci9jZGsgaW5jbHVkZXMgZmVhdHVyZSBJIG1lbnRpb25lZCBvbiBnaXRodWIgc2VlIGxpbmsgYmVsb3cuXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL21hdGVyaWFsMi9wdWxsLzU0OTMjaXNzdWVjb21tZW50LTMxMzA4NTMyM1xuICAgKi9cbiAgLyoqIERpc2FibGVzIGNsb3NlIG9mIHBvcG92ZXIgd2hlbiBsZWF2aW5nIHRyaWdnZXIgZWxlbWVudCBhbmQgbW91c2Ugb3ZlciB0aGUgcG9wb3ZlciAqL1xuICBvbk1vdXNlT3ZlcigpIHtcbiAgICBpZiAodGhpcy50cmlnZ2VyRXZlbnQgPT09ICdob3ZlcicpIHtcbiAgICAgIHRoaXMuY2xvc2VEaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuICB9XG4gIC8qKiBFbmFibGVzIGNsb3NlIG9mIHBvcG92ZXIgd2hlbiBtb3VzZSBsZWF2aW5nIHBvcG92ZXIgZWxlbWVudCAqL1xuICBvbk1vdXNlTGVhdmUoKSB7XG4gICAgaWYgKHRoaXMudHJpZ2dlckV2ZW50ID09PSAnaG92ZXInKSB7XG4gICAgICB0aGlzLmNsb3NlRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2VtaXRDbG9zZUV2ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgLy8gVE9ETzogUmVmYWN0b3IgaG93IHN0eWxlcyBhcmUgc2V0IGFuZCB1cGRhdGVkIG9uIHRoZSBjb21wb25lbnQsIHVzZSBiZXN0IHByYWN0aWNlcy5cbiAgLy8gVE9ETzogSWYgYXJyb3cgbGVmdCBhbmQgcmlnaHQgcG9zaXRpb25pbmcgaXMgcmVxdWVzdGVkLCBzZWUgaWYgZmxleCBkaXJlY3Rpb24gY2FuIGJlIHVzZWQgdG8gd29yayB3aXRoIG9yZGVyLlxuICAvKiogU2V0cyB0aGUgY3VycmVudCBzdHlsZXMgZm9yIHRoZSBwb3BvdmVyIHRvIGFsbG93IGZvciBkeW5hbWljYWxseSBjaGFuZ2luZyBzZXR0aW5ncyAqL1xuICBzZXRDdXJyZW50U3R5bGVzKCkge1xuXG4gICAgLy8gVE9ETzogU2VlIGlmIGFycm93IHBvc2l0aW9uIGNhbiBiZSBjYWxjdWxhdGVkIGF1dG9tYXRpY2FsbHkgYW5kIGFsbG93IG92ZXJyaWRlLlxuICAgIC8vIFRPRE86IFNlZSBpZiBmbGV4IG9yZGVyIGlzIGEgYmV0dGVyIGFsdGVybmF0aXZlIHRvIHBvc2l0aW9uIGFycm93IHRvcCBvciBib3R0b20uXG4gICAgdGhpcy5wb3BvdmVyQXJyb3dTdHlsZXMgPSB7XG4gICAgICAncmlnaHQnOiB0aGlzLnBvc2l0aW9uWCA9PT0gJ2JlZm9yZScgPyAodGhpcy5hcnJvd09mZnNldFggLSB0aGlzLmFycm93V2lkdGgpICsgJ3B4JyA6ICcnLFxuICAgICAgJ2xlZnQnOiB0aGlzLnBvc2l0aW9uWCA9PT0gJ2FmdGVyJyA/ICh0aGlzLmFycm93T2Zmc2V0WCAtIHRoaXMuYXJyb3dXaWR0aCkgKyAncHgnIDogJycsXG4gICAgICAnYm9yZGVyLXRvcCc6IHRoaXMucG9zaXRpb25ZID09PSAnYmVsb3cnID9cbiAgICAgICAgdGhpcy5hcnJvd1dpZHRoICsgJ3B4IHNvbGlkICcgKyB0aGlzLmFycm93Q29sb3IgOiAnMHB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICdib3JkZXItcmlnaHQnOiAndW5kZWZpbmVkJyA9PT0gdW5kZWZpbmVkID9cbiAgICAgICAgdGhpcy5hcnJvd1dpZHRoICsgJ3B4IHNvbGlkICcgKyB0aGlzLmFycm93Q29sb3IgOlxuICAgICAgICB0aGlzLmFycm93V2lkdGggKyAncHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgJ2JvcmRlci1ib3R0b20nOiB0aGlzLnBvc2l0aW9uWSA9PT0gJ2Fib3ZlJyA/XG4gICAgICAgIHRoaXMuYXJyb3dXaWR0aCArICdweCBzb2xpZCAnICsgdGhpcy5hcnJvd0NvbG9yIDpcbiAgICAgICAgdGhpcy5hcnJvd1dpZHRoICsgJ3B4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICdib3JkZXItbGVmdCc6ICd1bmRlZmluZWQnID09PSB1bmRlZmluZWQgP1xuICAgICAgICB0aGlzLmFycm93V2lkdGggKyAncHggc29saWQgJyArIHRoaXMuYXJyb3dDb2xvciA6XG4gICAgICAgIHRoaXMuYXJyb3dXaWR0aCArICdweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgfTtcblxuICAgIC8vIFRPRE86IFJlbW92ZSBpZiBmbGV4IG9yZGVyIGlzIGFkZGVkLlxuICAgIHRoaXMucG9wb3ZlckNvbnRlbnRTdHlsZXMgPSB7XG4gICAgICAncGFkZGluZy10b3AnOiB0aGlzLm92ZXJsYXBUcmlnZ2VyID09PSB0cnVlID8gJzBweCcgOiB0aGlzLmFycm93V2lkdGggKyAncHgnLFxuICAgICAgJ3BhZGRpbmctYm90dG9tJzogdGhpcy5vdmVybGFwVHJpZ2dlciA9PT0gdHJ1ZSA/ICcwcHgnIDogKHRoaXMuYXJyb3dXaWR0aCkgKyAncHgnLFxuICAgICAgJ21hcmdpbi10b3AnOiB0aGlzLm92ZXJsYXBUcmlnZ2VyID09PSBmYWxzZSAmJiB0aGlzLnBvc2l0aW9uWSA9PT0gJ2JlbG93JyAmJiB0aGlzLmNvbnRhaW5lclBvc2l0aW9uaW5nID09PSBmYWxzZSA/XG4gICAgICAgIC0odGhpcy5hcnJvd1dpZHRoICogMikgKyAncHgnIDogJzBweCdcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEl0J3MgbmVjZXNzYXJ5IHRvIHNldCBwb3NpdGlvbi1iYXNlZCBjbGFzc2VzIHRvIGVuc3VyZSB0aGUgcG9wb3ZlciBwYW5lbCBhbmltYXRpb25cbiAgICogZm9sZHMgb3V0IGZyb20gdGhlIGNvcnJlY3QgZGlyZWN0aW9uLlxuICAgKi9cbiAgc2V0UG9zaXRpb25DbGFzc2VzKHBvc1ggPSB0aGlzLnBvc2l0aW9uWCwgcG9zWSA9IHRoaXMucG9zaXRpb25ZKTogdm9pZCB7XG4gICAgdGhpcy5fY2xhc3NMaXN0WydtZGUtcG9wb3Zlci1iZWZvcmUnXSA9IHBvc1ggPT09ICdiZWZvcmUnO1xuICAgIHRoaXMuX2NsYXNzTGlzdFsnbWRlLXBvcG92ZXItYWZ0ZXInXSA9IHBvc1ggPT09ICdhZnRlcic7XG4gICAgdGhpcy5fY2xhc3NMaXN0WydtZGUtcG9wb3Zlci1hYm92ZSddID0gcG9zWSA9PT0gJ2Fib3ZlJztcbiAgICB0aGlzLl9jbGFzc0xpc3RbJ21kZS1wb3BvdmVyLWJlbG93J10gPSBwb3NZID09PSAnYmVsb3cnO1xuICB9XG59XG4iLCI8bmctdGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJtZGUtcG9wb3Zlci1wYW5lbFwiIHJvbGU9XCJkaWFsb2dcIiBbY2xhc3MubWRlLXBvcG92ZXItb3ZlcmxhcF09XCJvdmVybGFwVHJpZ2dlclwiXG4gICAgICAgW25nQ2xhc3NdPVwiX2NsYXNzTGlzdFwiIFtuZ1N0eWxlXT1cInBvcG92ZXJQYW5lbFN0eWxlc1wiIChrZXlkb3duKT1cIl9oYW5kbGVLZXlkb3duKCRldmVudClcIlxuICAgICAgIChjbGljayk9XCJvbkNsaWNrKClcIiAobW91c2VvdmVyKT1cIm9uTW91c2VPdmVyKClcIiAobW91c2VsZWF2ZSk9XCJvbk1vdXNlTGVhdmUoKVwiIFtALmRpc2FibGVkXT1cImRpc2FibGVBbmltYXRpb25cIlxuICAgICAgIFtAdHJhbnNmb3JtUG9wb3Zlcl09XCInZW50ZXInXCI+XG4gICAgPGRpdiBjbGFzcz1cIm1kZS1wb3BvdmVyLWRpcmVjdGlvbi1hcnJvd1wiIFtuZ1N0eWxlXT1cInBvcG92ZXJBcnJvd1N0eWxlc1wiICpuZ0lmPVwiIW92ZXJsYXBUcmlnZ2VyXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cIm1kZS1wb3BvdmVyLWNvbnRlbnRcIiBbbmdTdHlsZV09XCJwb3BvdmVyQ29udGVudFN0eWxlc1wiIFtjZGtUcmFwRm9jdXNdPVwiZm9jdXNUcmFwRW5hYmxlZFwiIFtjZGtUcmFwRm9jdXNBdXRvQ2FwdHVyZV09XCJmb2N1c1RyYXBBdXRvQ2FwdHVyZUVuYWJsZWRcIj5cbiAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L25nLXRlbXBsYXRlPlxuIl19