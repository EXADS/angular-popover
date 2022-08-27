import { isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import { OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Directive, EventEmitter, HostBinding, HostListener, Input, Optional, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { throwMdePopoverMissingError } from './popover-errors';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "@angular/cdk/bidi";
/**
 * This directive is intended to be used in conjunction with an mde-popover tag. It is
 * responsible for toggling the display of the provided popover instance.
 */
export class MdePopoverTrigger {
    constructor(_overlay, _elementRef, _viewContainerRef, _dir, _changeDetectorRef) {
        this._overlay = _overlay;
        this._elementRef = _elementRef;
        this._viewContainerRef = _viewContainerRef;
        this._dir = _dir;
        this._changeDetectorRef = _changeDetectorRef;
        this.ariaHaspopup = true;
        this.popoverOpened = new Subject();
        this.popoverClosed = new Subject();
        this._overlayRef = null;
        this._popoverOpen = false;
        this._halt = false;
        // tracking input type is necessary so it's possible to only auto-focus
        // the first item of the list when the popover is opened via the keyboard
        this._openedByMouse = false;
        this._onDestroy = new Subject();
        /** Popover backdrop close on click */
        this.backdropCloseOnClick = true;
        /** Event emitted when the associated popover is opened. */
        this.opened = new EventEmitter();
        /** Event emitted when the associated popover is closed. */
        this.closed = new EventEmitter();
    }
    ngAfterViewInit() {
        this._checkPopover();
        this._setCurrentConfig();
        this.popover.close.subscribe(() => this.closePopover());
    }
    ngOnDestroy() {
        this.destroyPopover();
    }
    _setCurrentConfig() {
        if (this.positionX === 'before' || this.positionX === 'after') {
            this.popover.positionX = this.positionX;
        }
        if (this.positionY === 'above' || this.positionY === 'below') {
            this.popover.positionY = this.positionY;
        }
        if (this.triggerEvent) {
            this.popover.triggerEvent = this.triggerEvent;
        }
        if (this.enterDelay) {
            this.popover.enterDelay = this.enterDelay;
        }
        if (this.leaveDelay) {
            this.popover.leaveDelay = this.leaveDelay;
        }
        if (this.overlapTrigger === true || this.overlapTrigger === false) {
            this.popover.overlapTrigger = this.overlapTrigger;
        }
        if (this.targetOffsetX) {
            this.popover.targetOffsetX = this.targetOffsetX;
        }
        if (this.targetOffsetY) {
            this.popover.targetOffsetY = this.targetOffsetY;
        }
        if (this.arrowOffsetX) {
            this.popover.arrowOffsetX = this.arrowOffsetX;
        }
        if (this.arrowWidth) {
            this.popover.arrowWidth = this.arrowWidth;
        }
        if (this.arrowColor) {
            this.popover.arrowColor = this.arrowColor;
        }
        if (this.closeOnClick === true || this.closeOnClick === false) {
            this.popover.closeOnClick = this.closeOnClick;
        }
        this.popover.setCurrentStyles();
    }
    /** Whether the popover is open. */
    get popoverOpen() { return this._popoverOpen; }
    onClick(_event) {
        if (this.popover.triggerEvent === 'click') {
            this.togglePopover();
        }
    }
    onMouseEnter(_event) {
        this._halt = false;
        if (this.popover.triggerEvent === 'hover') {
            this._mouseoverTimer = setTimeout(() => {
                this.openPopover();
            }, this.popover.enterDelay);
        }
    }
    onMouseLeave(_event) {
        if (this.popover.triggerEvent === 'hover') {
            if (this._mouseoverTimer) {
                clearTimeout(this._mouseoverTimer);
                this._mouseoverTimer = null;
            }
            if (this._popoverOpen) {
                setTimeout(() => {
                    if (!this.popover.closeDisabled) {
                        this.closePopover();
                    }
                }, this.popover.leaveDelay);
            }
            else {
                this._halt = true;
            }
        }
    }
    /** Toggles the popover between the open and closed states. */
    togglePopover() {
        return this._popoverOpen ? this.closePopover() : this.openPopover();
    }
    /** Opens the popover. */
    openPopover() {
        if (!this._popoverOpen && !this._halt) {
            this._createOverlay().attach(this._portal);
            this._subscribeToBackdrop();
            this._subscribeToDetachments();
            this._initPopover();
        }
    }
    /** Closes the popover. */
    closePopover() {
        if (this._overlayRef) {
            this._overlayRef.detach();
            this._resetPopover();
        }
    }
    /** Removes the popover from the DOM. */
    destroyPopover() {
        if (this._mouseoverTimer) {
            clearTimeout(this._mouseoverTimer);
            this._mouseoverTimer = null;
        }
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = null;
            this._cleanUpSubscriptions();
        }
        this._onDestroy.next();
        this._onDestroy.complete();
    }
    /** Focuses the popover trigger. */
    focus() {
        this._elementRef.nativeElement.focus();
    }
    /** The text direction of the containing app. */
    get dir() {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    }
    /**
     * This method ensures that the popover closes when the overlay backdrop is clicked.
     * We do not use first() here because doing so would not catch clicks from within
     * the popover, and it would fail to unsubscribe properly. Instead, we unsubscribe
     * explicitly when the popover is closed or destroyed.
     */
    _subscribeToBackdrop() {
        if (this._overlayRef) {
            /** Only subscribe to backdrop if trigger event is click */
            if (this.triggerEvent === 'click' && this.backdropCloseOnClick === true) {
                this._overlayRef.backdropClick()
                    .pipe(
                // @ts-ignore
                takeUntil(this.popoverClosed), takeUntil(this._onDestroy))
                    .subscribe(() => {
                    this.popover._emitCloseEvent();
                });
            }
        }
    }
    _subscribeToDetachments() {
        if (this._overlayRef) {
            this._overlayRef.detachments()
                .pipe(
            // @ts-ignore
            takeUntil(this.popoverClosed), takeUntil(this._onDestroy))
                .subscribe(() => {
                this._setPopoverClosed();
            });
        }
    }
    /**
     * This method sets the popover state to open and focuses the first item if
     * the popover was opened via the keyboard.
     */
    _initPopover() {
        this._setPopoverOpened();
    }
    /**
     * This method resets the popover when it's closed, most importantly restoring
     * focus to the popover trigger if the popover was opened via the keyboard.
     */
    _resetPopover() {
        this._setPopoverClosed();
        // Focus only needs to be reset to the host element if the popover was opened
        // by the keyboard and manually shifted to the first popover item.
        if (!this._openedByMouse) {
            this.focus();
        }
        this._openedByMouse = false;
    }
    /** set state rather than toggle to support triggers sharing a popover */
    _setPopoverOpened() {
        if (!this._popoverOpen) {
            this._popoverOpen = true;
            this.popoverOpened.next();
            this.opened.emit();
        }
    }
    /** set state rather than toggle to support triggers sharing a popover */
    _setPopoverClosed() {
        if (this._popoverOpen) {
            this._popoverOpen = false;
            this.popoverClosed.next();
            this.closed.emit();
        }
    }
    /**
     *  This method checks that a valid instance of MdPopover has been passed into
     *  mdPopoverTriggerFor. If not, an exception is thrown.
     */
    _checkPopover() {
        if (!this.popover) {
            throwMdePopoverMissingError();
        }
    }
    /**
     *  This method creates the overlay from the provided popover's template and saves its
     *  OverlayRef so that it can be attached to the DOM when openPopover is called.
     */
    _createOverlay() {
        if (!this._overlayRef) {
            this._portal = new TemplatePortal(this.popover.templateRef, this._viewContainerRef);
            const config = this._getOverlayConfig();
            this._subscribeToPositions(config.positionStrategy);
            this._overlayRef = this._overlay.create(config);
        }
        return this._overlayRef;
    }
    /**
     * This method builds the configuration object needed to create the overlay, the OverlayConfig.
     * @returns OverlayConfig
     */
    _getOverlayConfig() {
        const overlayState = new OverlayConfig();
        overlayState.positionStrategy = this._getPosition();
        /** Display overlay backdrop if trigger event is click */
        if (this.triggerEvent === 'click') {
            overlayState.hasBackdrop = true;
            overlayState.backdropClass = 'cdk-overlay-transparent-backdrop';
        }
        overlayState.direction = this.dir;
        overlayState.scrollStrategy = this._getOverlayScrollStrategy(this.popover.scrollStrategy);
        return overlayState;
    }
    /**
     * This method returns the scroll strategy used by the cdk/overlay.
     */
    _getOverlayScrollStrategy(strategy) {
        switch (strategy) {
            case 'noop':
                return this._overlay.scrollStrategies.noop();
            case 'close':
                return this._overlay.scrollStrategies.close();
            case 'block':
                return this._overlay.scrollStrategies.block();
            case 'reposition':
            default:
                return this._overlay.scrollStrategies.reposition();
        }
    }
    /**
     * Listens to changes in the position of the overlay and sets the correct classes
     * on the popover based on the new position. This ensures the animation origin is always
     * correct, even if a fallback position is used for the overlay.
     */
    _subscribeToPositions(position) {
        // @ts-ignore
        this._positionSubscription = position.positionChanges.subscribe(change => {
            const posisionX = change.connectionPair.overlayX === 'start' ? 'after' : 'before';
            let posisionY = change.connectionPair.overlayY === 'top' ? 'below' : 'above';
            if (!this.popover.overlapTrigger) {
                posisionY = posisionY === 'below' ? 'above' : 'below';
            }
            // required for ChangeDetectionStrategy.OnPush
            this._changeDetectorRef.markForCheck();
            this.popover.zone.run(() => {
                this.popover.positionX = posisionX;
                this.popover.positionY = posisionY;
                this.popover.setCurrentStyles();
                this.popover.setPositionClasses(posisionX, posisionY);
            });
        });
    }
    /**
     * This method builds the position strategy for the overlay, so the popover is properly connected
     * to the trigger.
     * @returns ConnectedPositionStrategy
     */
    _getPosition() {
        const [originX, originFallbackX] = this.popover.positionX === 'before' ? ['end', 'start'] : ['start', 'end'];
        const [overlayY, overlayFallbackY] = this.popover.positionY === 'above' ? ['bottom', 'top'] : ['top', 'bottom'];
        // let originY = overlayY;
        // let fallbackOriginY = overlayFallbackY;
        let originY = overlayY;
        let originFallbackY = overlayFallbackY;
        const overlayX = originX;
        const overlayFallbackX = originFallbackX;
        // let [originY, originFallbackY] = [overlayY, overlayFallbackY];
        // let [overlayX, overlayFallbackX] = [originX, originFallbackX];
        /** Reverse overlayY and fallbackOverlayY when overlapTrigger is false */
        if (!this.popover.overlapTrigger) {
            originY = overlayY === 'top' ? 'bottom' : 'top';
            originFallbackY = overlayFallbackY === 'top' ? 'bottom' : 'top';
        }
        let offsetX = 0;
        let offsetY = 0;
        if (this.popover.targetOffsetX && !isNaN(Number(this.popover.targetOffsetX))) {
            offsetX = Number(this.popover.targetOffsetX);
            // offsetX = -16;
        }
        if (this.popover.targetOffsetY && !isNaN(Number(this.popover.targetOffsetY))) {
            offsetY = Number(this.popover.targetOffsetY);
            // offsetY = -10;
        }
        /**
         * For overriding position element, when mdePopoverTargetAt has a valid element reference.
         * Useful for sticking popover to parent element and offsetting arrow to trigger element.
         * If undefined defaults to the trigger element reference.
         */
        let element = this._elementRef;
        if (typeof this.targetElement !== 'undefined') {
            this.popover.containerPositioning = true;
            element = this.targetElement._elementRef;
        }
        return this._overlay.position()
            .flexibleConnectedTo(element)
            .withLockedPosition(true)
            .withPositions([
            {
                originX,
                originY,
                overlayX,
                overlayY,
                offsetY
            },
            {
                originX: originFallbackX,
                originY,
                overlayX: overlayFallbackX,
                overlayY,
                offsetY
            },
            {
                originX,
                originY: originFallbackY,
                overlayX,
                overlayY: overlayFallbackY,
                offsetY: -offsetY
            },
            {
                originX: originFallbackX,
                originY: originFallbackY,
                overlayX: overlayFallbackX,
                overlayY: overlayFallbackY,
                offsetY: -offsetY
            }
        ])
            .withDefaultOffsetX(offsetX)
            .withDefaultOffsetY(offsetY);
    }
    _cleanUpSubscriptions() {
        if (this._backdropSubscription) {
            this._backdropSubscription.unsubscribe();
        }
        if (this._positionSubscription) {
            this._positionSubscription.unsubscribe();
        }
        if (this._detachmentsSubscription) {
            this._detachmentsSubscription.unsubscribe();
        }
    }
    _handleMousedown(event) {
        if (event && !isFakeMousedownFromScreenReader(event)) {
            this._openedByMouse = true;
        }
    }
}
MdePopoverTrigger.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: MdePopoverTrigger, deps: [{ token: i1.Overlay }, { token: i0.ElementRef }, { token: i0.ViewContainerRef }, { token: i2.Directionality, optional: true }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
MdePopoverTrigger.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.11", type: MdePopoverTrigger, selector: "[mdePopoverTriggerFor]", inputs: { popover: ["mdePopoverTriggerFor", "popover"], targetElement: ["mdePopoverTargetAt", "targetElement"], positionX: ["mdePopoverPositionX", "positionX"], positionY: ["mdePopoverPositionY", "positionY"], triggerEvent: ["mdePopoverTriggerOn", "triggerEvent"], enterDelay: ["mdePopoverEnterDelay", "enterDelay"], leaveDelay: ["mdePopoverLeaveDelay", "leaveDelay"], overlapTrigger: ["mdePopoverOverlapTrigger", "overlapTrigger"], targetOffsetX: ["mdePopoverOffsetX", "targetOffsetX"], targetOffsetY: ["mdePopoverOffsetY", "targetOffsetY"], arrowOffsetX: ["mdePopoverArrowOffsetX", "arrowOffsetX"], arrowWidth: ["mdePopoverArrowWidth", "arrowWidth"], arrowColor: ["mdePopoverArrowColor", "arrowColor"], closeOnClick: ["mdePopoverCloseOnClick", "closeOnClick"], backdropCloseOnClick: ["mdePopoverBackdropCloseOnClick", "backdropCloseOnClick"] }, outputs: { opened: "opened", closed: "closed" }, host: { listeners: { "click": "onClick($event)", "mouseenter": "onMouseEnter($event)", "mouseleave": "onMouseLeave($event)", "mousedown": "_handleMousedown($event)" }, properties: { "attr.aria-haspopup": "this.ariaHaspopup" } }, exportAs: ["mdePopoverTrigger"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: MdePopoverTrigger, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mdePopoverTriggerFor]',
                    exportAs: 'mdePopoverTrigger'
                }]
        }], ctorParameters: function () { return [{ type: i1.Overlay }, { type: i0.ElementRef }, { type: i0.ViewContainerRef }, { type: i2.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { ariaHaspopup: [{
                type: HostBinding,
                args: ['attr.aria-haspopup']
            }], popover: [{
                type: Input,
                args: ['mdePopoverTriggerFor']
            }], targetElement: [{
                type: Input,
                args: ['mdePopoverTargetAt']
            }], positionX: [{
                type: Input,
                args: ['mdePopoverPositionX']
            }], positionY: [{
                type: Input,
                args: ['mdePopoverPositionY']
            }], triggerEvent: [{
                type: Input,
                args: ['mdePopoverTriggerOn']
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
            }], backdropCloseOnClick: [{
                type: Input,
                args: ['mdePopoverBackdropCloseOnClick']
            }], opened: [{
                type: Output
            }], closed: [{
                type: Output
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }], onMouseEnter: [{
                type: HostListener,
                args: ['mouseenter', ['$event']]
            }], onMouseLeave: [{
                type: HostListener,
                args: ['mouseleave', ['$event']]
            }], _handleMousedown: [{
                type: HostListener,
                args: ['mousedown', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci10cmlnZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbWF0ZXJpYWwtZXh0ZW5kZWQvbWRlL3NyYy9saWIvcG9wb3Zlci9wb3BvdmVyLXRyaWdnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLCtCQUErQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFcEUsT0FBTyxFQUNnRSxhQUFhLEVBQ25GLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3JELE9BQU8sRUFDNkIsU0FBUyxFQUUzQyxZQUFZLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBRTlDLFFBQVEsRUFDUixNQUFNLEVBRVAsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLE9BQU8sRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFDN0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLGtCQUFrQixDQUFDOzs7O0FBSS9EOzs7R0FHRztBQU1ILE1BQU0sT0FBTyxpQkFBaUI7SUErRTVCLFlBQW9CLFFBQWlCLEVBQVMsV0FBdUIsRUFDakQsaUJBQW1DLEVBQ3ZCLElBQW9CLEVBQ2hDLGtCQUFxQztRQUhyQyxhQUFRLEdBQVIsUUFBUSxDQUFTO1FBQVMsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFDakQsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUN2QixTQUFJLEdBQUosSUFBSSxDQUFnQjtRQUNoQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBaEZ0QixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUV2RCxrQkFBYSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFDcEMsa0JBQWEsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBRzVC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U0FBUztzQkFBdEMsS0FBSzt1QkFBQyxxQkFBcUI7Z0JBR0UsU0FBUztzQkFBdEMsS0FBSzt1QkFBQyxxQkFBcUI7Z0JBR0UsWUFBWTtzQkFBekMsS0FBSzt1QkFBQyxxQkFBcUI7Z0JBR0csVUFBVTtzQkFBeEMsS0FBSzt1QkFBQyxzQkFBc0I7Z0JBR0UsVUFBVTtzQkFBeEMsS0FBSzt1QkFBQyxzQkFBc0I7Z0JBR00sY0FBYztzQkFBaEQsS0FBSzt1QkFBQywwQkFBMEI7Z0JBR0wsYUFBYTtzQkFBeEMsS0FBSzt1QkFBQyxtQkFBbUI7Z0JBR0UsYUFBYTtzQkFBeEMsS0FBSzt1QkFBQyxtQkFBbUI7Z0JBR08sWUFBWTtzQkFBNUMsS0FBSzt1QkFBQyx3QkFBd0I7Z0JBSUEsVUFBVTtzQkFBeEMsS0FBSzt1QkFBQyxzQkFBc0I7Z0JBSUUsVUFBVTtzQkFBeEMsS0FBSzt1QkFBQyxzQkFBc0I7Z0JBSUksWUFBWTtzQkFBNUMsS0FBSzt1QkFBQyx3QkFBd0I7Z0JBSVUsb0JBQW9CO3NCQUE1RCxLQUFLO3VCQUFDLGdDQUFnQztnQkFHN0IsTUFBTTtzQkFBZixNQUFNO2dCQUdHLE1BQU07c0JBQWYsTUFBTTtnQkE0RVAsT0FBTztzQkFETixZQUFZO3VCQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkFRakMsWUFBWTtzQkFEWCxZQUFZO3VCQUFDLFlBQVksRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkFXdEMsWUFBWTtzQkFEWCxZQUFZO3VCQUFDLFlBQVksRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkF1VkMsZ0JBQWdCO3NCQUF0RCxZQUFZO3VCQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzRmFrZU1vdXNlZG93bkZyb21TY3JlZW5SZWFkZXIgfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQgeyBEaXJlY3Rpb24sIERpcmVjdGlvbmFsaXR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtcbiAgRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5LCBIb3Jpem9udGFsQ29ubmVjdGlvblBvcywgT3ZlcmxheSwgT3ZlcmxheUNvbmZpZywgT3ZlcmxheVJlZiwgU2Nyb2xsU3RyYXRlZ3ksIFZlcnRpY2FsQ29ubmVjdGlvblBvc1xufSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQgeyBUZW1wbGF0ZVBvcnRhbCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCwgQ2hhbmdlRGV0ZWN0b3JSZWYsIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLCBIb3N0QmluZGluZywgSG9zdExpc3RlbmVyLCBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBWaWV3Q29udGFpbmVyUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyB0aHJvd01kZVBvcG92ZXJNaXNzaW5nRXJyb3IgfSBmcm9tICcuL3BvcG92ZXItZXJyb3JzJztcbmltcG9ydCB7IE1kZVBvcG92ZXJQYW5lbCwgTWRlVGFyZ2V0IH0gZnJvbSAnLi9wb3BvdmVyLWludGVyZmFjZXMnO1xuaW1wb3J0IHsgTWRlUG9wb3ZlclBvc2l0aW9uWCwgTWRlUG9wb3ZlclBvc2l0aW9uWSwgTWRlUG9wb3ZlclNjcm9sbFN0cmF0ZWd5LCBNZGVQb3BvdmVyVHJpZ2dlckV2ZW50IH0gZnJvbSAnLi9wb3BvdmVyLXR5cGVzJztcblxuLyoqXG4gKiBUaGlzIGRpcmVjdGl2ZSBpcyBpbnRlbmRlZCB0byBiZSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggYW4gbWRlLXBvcG92ZXIgdGFnLiBJdCBpc1xuICogcmVzcG9uc2libGUgZm9yIHRvZ2dsaW5nIHRoZSBkaXNwbGF5IG9mIHRoZSBwcm92aWRlZCBwb3BvdmVyIGluc3RhbmNlLlxuICovXG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttZGVQb3BvdmVyVHJpZ2dlckZvcl0nLFxuICBleHBvcnRBczogJ21kZVBvcG92ZXJUcmlnZ2VyJ1xufSlcbmV4cG9ydCBjbGFzcyBNZGVQb3BvdmVyVHJpZ2dlciBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7IC8vIHRzbGludDpkaXNhYmxlLWxpbmU6ZGlyZWN0aXZlLWNsYXNzLXN1ZmZpeFxuXG4gIEBIb3N0QmluZGluZygnYXR0ci5hcmlhLWhhc3BvcHVwJykgYXJpYUhhc3BvcHVwID0gdHJ1ZTtcblxuICBwb3BvdmVyT3BlbmVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgcG9wb3ZlckNsb3NlZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgcHJpdmF0ZSBfcG9ydGFsOiBUZW1wbGF0ZVBvcnRhbDxhbnk+O1xuICBwcml2YXRlIF9vdmVybGF5UmVmOiBPdmVybGF5UmVmIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgX3BvcG92ZXJPcGVuID0gZmFsc2U7XG4gIHByaXZhdGUgX2hhbHQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfYmFja2Ryb3BTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBfcG9zaXRpb25TdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBfZGV0YWNobWVudHNTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBwcml2YXRlIF9tb3VzZW92ZXJUaW1lcjogYW55O1xuXG4gIC8vIHRyYWNraW5nIGlucHV0IHR5cGUgaXMgbmVjZXNzYXJ5IHNvIGl0J3MgcG9zc2libGUgdG8gb25seSBhdXRvLWZvY3VzXG4gIC8vIHRoZSBmaXJzdCBpdGVtIG9mIHRoZSBsaXN0IHdoZW4gdGhlIHBvcG92ZXIgaXMgb3BlbmVkIHZpYSB0aGUga2V5Ym9hcmRcbiAgcHJpdmF0ZSBfb3BlbmVkQnlNb3VzZSA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX29uRGVzdHJveSA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFJlZmVyZW5jZXMgdGhlIHBvcG92ZXIgaW5zdGFuY2UgdGhhdCB0aGUgdHJpZ2dlciBpcyBhc3NvY2lhdGVkIHdpdGguICovXG4gIEBJbnB1dCgnbWRlUG9wb3ZlclRyaWdnZXJGb3InKSBwb3BvdmVyOiBNZGVQb3BvdmVyUGFuZWw7XG5cbiAgLyoqIFJlZmVyZW5jZXMgdGhlIHBvcG92ZXIgdGFyZ2V0IGluc3RhbmNlIHRoYXQgdGhlIHRyaWdnZXIgaXMgYXNzb2NpYXRlZCB3aXRoLiAqL1xuICBASW5wdXQoJ21kZVBvcG92ZXJUYXJnZXRBdCcpIHRhcmdldEVsZW1lbnQ6IE1kZVRhcmdldDtcblxuICAvKiogUG9zaXRpb24gb2YgdGhlIHBvcG92ZXIgaW4gdGhlIFggYXhpcyAqL1xuICBASW5wdXQoJ21kZVBvcG92ZXJQb3NpdGlvblgnKSBwb3NpdGlvblg6IE1kZVBvcG92ZXJQb3NpdGlvblg7XG5cbiAgLyoqIFBvc2l0aW9uIG9mIHRoZSBwb3BvdmVyIGluIHRoZSBZIGF4aXMgKi9cbiAgQElucHV0KCdtZGVQb3BvdmVyUG9zaXRpb25ZJykgcG9zaXRpb25ZOiBNZGVQb3BvdmVyUG9zaXRpb25ZO1xuXG4gIC8qKiBQb3BvdmVyIHRyaWdnZXIgZXZlbnQgKi9cbiAgQElucHV0KCdtZGVQb3BvdmVyVHJpZ2dlck9uJykgdHJpZ2dlckV2ZW50OiBNZGVQb3BvdmVyVHJpZ2dlckV2ZW50O1xuXG4gIC8qKiBQb3BvdmVyIGRlbGF5ICovXG4gIEBJbnB1dCgnbWRlUG9wb3ZlckVudGVyRGVsYXknKSBlbnRlckRlbGF5OiBudW1iZXI7XG5cbiAgLyoqIFBvcG92ZXIgZGVsYXkgKi9cbiAgQElucHV0KCdtZGVQb3BvdmVyTGVhdmVEZWxheScpIGxlYXZlRGVsYXk6IG51bWJlcjtcblxuICAvKiogUG9wb3ZlciBvdmVybGFwIHRyaWdnZXIgKi9cbiAgQElucHV0KCdtZGVQb3BvdmVyT3ZlcmxhcFRyaWdnZXInKSBvdmVybGFwVHJpZ2dlcjogYm9vbGVhbjtcblxuICAvKiogUG9wb3ZlciB0YXJnZXQgb2Zmc2V0IHggKi9cbiAgQElucHV0KCdtZGVQb3BvdmVyT2Zmc2V0WCcpIHRhcmdldE9mZnNldFg6IG51bWJlcjtcblxuICAvKiogUG9wb3ZlciB0YXJnZXQgb2Zmc2V0IHkgKi9cbiAgQElucHV0KCdtZGVQb3BvdmVyT2Zmc2V0WScpIHRhcmdldE9mZnNldFk6IG51bWJlcjtcblxuICAvKiogUG9wb3ZlciBhcnJvdyBvZmZzZXQgeCAqL1xuICBASW5wdXQoJ21kZVBvcG92ZXJBcnJvd09mZnNldFgnKSBhcnJvd09mZnNldFg6IG51bWJlcjtcblxuXG4gIC8qKiBQb3BvdmVyIGFycm93IHdpZHRoICovXG4gIEBJbnB1dCgnbWRlUG9wb3ZlckFycm93V2lkdGgnKSBhcnJvd1dpZHRoOiBudW1iZXI7XG5cblxuICAvKiogUG9wb3ZlciBhcnJvdyBjb2xvciAqL1xuICBASW5wdXQoJ21kZVBvcG92ZXJBcnJvd0NvbG9yJykgYXJyb3dDb2xvcjogc3RyaW5nO1xuXG5cbiAgLyoqIFBvcG92ZXIgY29udGFpbmVyIGNsb3NlIG9uIGNsaWNrICovXG4gIEBJbnB1dCgnbWRlUG9wb3ZlckNsb3NlT25DbGljaycpIGNsb3NlT25DbGljazogYm9vbGVhbjtcblxuXG4gIC8qKiBQb3BvdmVyIGJhY2tkcm9wIGNsb3NlIG9uIGNsaWNrICovXG4gIEBJbnB1dCgnbWRlUG9wb3ZlckJhY2tkcm9wQ2xvc2VPbkNsaWNrJykgYmFja2Ryb3BDbG9zZU9uQ2xpY2sgPSB0cnVlO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGFzc29jaWF0ZWQgcG9wb3ZlciBpcyBvcGVuZWQuICovXG4gIEBPdXRwdXQoKSBvcGVuZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgYXNzb2NpYXRlZCBwb3BvdmVyIGlzIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgpIGNsb3NlZCA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX292ZXJsYXk6IE92ZXJsYXksIHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmKSB7IH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5fY2hlY2tQb3BvdmVyKCk7XG4gICAgdGhpcy5fc2V0Q3VycmVudENvbmZpZygpO1xuICAgIHRoaXMucG9wb3Zlci5jbG9zZS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jbG9zZVBvcG92ZXIoKSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmRlc3Ryb3lQb3BvdmVyKCk7XG4gIH1cblxuICBwcml2YXRlIF9zZXRDdXJyZW50Q29uZmlnKCkge1xuXG4gICAgaWYgKHRoaXMucG9zaXRpb25YID09PSAnYmVmb3JlJyB8fCB0aGlzLnBvc2l0aW9uWCA9PT0gJ2FmdGVyJykge1xuICAgICAgdGhpcy5wb3BvdmVyLnBvc2l0aW9uWCA9IHRoaXMucG9zaXRpb25YO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBvc2l0aW9uWSA9PT0gJ2Fib3ZlJyB8fCB0aGlzLnBvc2l0aW9uWSA9PT0gJ2JlbG93Jykge1xuICAgICAgdGhpcy5wb3BvdmVyLnBvc2l0aW9uWSA9IHRoaXMucG9zaXRpb25ZO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnRyaWdnZXJFdmVudCkge1xuICAgICAgdGhpcy5wb3BvdmVyLnRyaWdnZXJFdmVudCA9IHRoaXMudHJpZ2dlckV2ZW50O1xuICAgIH1cblxuICAgIGlmICh0aGlzLmVudGVyRGVsYXkpIHtcbiAgICAgIHRoaXMucG9wb3Zlci5lbnRlckRlbGF5ID0gdGhpcy5lbnRlckRlbGF5O1xuICAgIH1cblxuICAgIGlmICh0aGlzLmxlYXZlRGVsYXkpIHtcbiAgICAgIHRoaXMucG9wb3Zlci5sZWF2ZURlbGF5ID0gdGhpcy5sZWF2ZURlbGF5O1xuICAgIH1cblxuICAgIGlmICh0aGlzLm92ZXJsYXBUcmlnZ2VyID09PSB0cnVlIHx8IHRoaXMub3ZlcmxhcFRyaWdnZXIgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLnBvcG92ZXIub3ZlcmxhcFRyaWdnZXIgPSB0aGlzLm92ZXJsYXBUcmlnZ2VyO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnRhcmdldE9mZnNldFgpIHtcbiAgICAgIHRoaXMucG9wb3Zlci50YXJnZXRPZmZzZXRYID0gdGhpcy50YXJnZXRPZmZzZXRYO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnRhcmdldE9mZnNldFkpIHtcbiAgICAgIHRoaXMucG9wb3Zlci50YXJnZXRPZmZzZXRZID0gdGhpcy50YXJnZXRPZmZzZXRZO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFycm93T2Zmc2V0WCkge1xuICAgICAgdGhpcy5wb3BvdmVyLmFycm93T2Zmc2V0WCA9IHRoaXMuYXJyb3dPZmZzZXRYO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFycm93V2lkdGgpIHtcbiAgICAgIHRoaXMucG9wb3Zlci5hcnJvd1dpZHRoID0gdGhpcy5hcnJvd1dpZHRoO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFycm93Q29sb3IpIHtcbiAgICAgIHRoaXMucG9wb3Zlci5hcnJvd0NvbG9yID0gdGhpcy5hcnJvd0NvbG9yO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNsb3NlT25DbGljayA9PT0gdHJ1ZSB8fCB0aGlzLmNsb3NlT25DbGljayA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMucG9wb3Zlci5jbG9zZU9uQ2xpY2sgPSB0aGlzLmNsb3NlT25DbGljaztcbiAgICB9XG5cbiAgICB0aGlzLnBvcG92ZXIuc2V0Q3VycmVudFN0eWxlcygpO1xuICB9XG5cblxuICAvKiogV2hldGhlciB0aGUgcG9wb3ZlciBpcyBvcGVuLiAqL1xuICBnZXQgcG9wb3Zlck9wZW4oKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9wb3BvdmVyT3BlbjsgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSlcbiAgb25DbGljayhfZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5wb3BvdmVyLnRyaWdnZXJFdmVudCA9PT0gJ2NsaWNrJykge1xuICAgICAgdGhpcy50b2dnbGVQb3BvdmVyKCk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2VlbnRlcicsIFsnJGV2ZW50J10pXG4gIG9uTW91c2VFbnRlcihfZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLl9oYWx0ID0gZmFsc2U7XG4gICAgaWYgKHRoaXMucG9wb3Zlci50cmlnZ2VyRXZlbnQgPT09ICdob3ZlcicpIHtcbiAgICAgIHRoaXMuX21vdXNlb3ZlclRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMub3BlblBvcG92ZXIoKTtcbiAgICAgIH0sIHRoaXMucG9wb3Zlci5lbnRlckRlbGF5KTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWxlYXZlJywgWyckZXZlbnQnXSlcbiAgb25Nb3VzZUxlYXZlKF9ldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnBvcG92ZXIudHJpZ2dlckV2ZW50ID09PSAnaG92ZXInKSB7XG4gICAgICBpZiAodGhpcy5fbW91c2VvdmVyVGltZXIpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX21vdXNlb3ZlclRpbWVyKTtcbiAgICAgICAgdGhpcy5fbW91c2VvdmVyVGltZXIgPSBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX3BvcG92ZXJPcGVuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGlmICghdGhpcy5wb3BvdmVyLmNsb3NlRGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VQb3BvdmVyKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzLnBvcG92ZXIubGVhdmVEZWxheSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9oYWx0ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgcG9wb3ZlciBiZXR3ZWVuIHRoZSBvcGVuIGFuZCBjbG9zZWQgc3RhdGVzLiAqL1xuICB0b2dnbGVQb3BvdmVyKCk6IHZvaWQge1xuICAgIHJldHVybiB0aGlzLl9wb3BvdmVyT3BlbiA/IHRoaXMuY2xvc2VQb3BvdmVyKCkgOiB0aGlzLm9wZW5Qb3BvdmVyKCk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIHBvcG92ZXIuICovXG4gIG9wZW5Qb3BvdmVyKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fcG9wb3Zlck9wZW4gJiYgIXRoaXMuX2hhbHQpIHtcbiAgICAgIHRoaXMuX2NyZWF0ZU92ZXJsYXkoKS5hdHRhY2godGhpcy5fcG9ydGFsKTtcblxuICAgICAgdGhpcy5fc3Vic2NyaWJlVG9CYWNrZHJvcCgpO1xuICAgICAgdGhpcy5fc3Vic2NyaWJlVG9EZXRhY2htZW50cygpO1xuXG4gICAgICB0aGlzLl9pbml0UG9wb3ZlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDbG9zZXMgdGhlIHBvcG92ZXIuICovXG4gIGNsb3NlUG9wb3ZlcigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kZXRhY2goKTtcbiAgICAgIHRoaXMuX3Jlc2V0UG9wb3ZlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZW1vdmVzIHRoZSBwb3BvdmVyIGZyb20gdGhlIERPTS4gKi9cbiAgZGVzdHJveVBvcG92ZXIoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX21vdXNlb3ZlclRpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fbW91c2VvdmVyVGltZXIpO1xuICAgICAgdGhpcy5fbW91c2VvdmVyVGltZXIgPSBudWxsO1xuICAgIH1cbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kaXNwb3NlKCk7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmID0gbnVsbDtcbiAgICAgIHRoaXMuX2NsZWFuVXBTdWJzY3JpcHRpb25zKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fb25EZXN0cm95Lm5leHQoKTtcbiAgICB0aGlzLl9vbkRlc3Ryb3kuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBwb3BvdmVyIHRyaWdnZXIuICovXG4gIGZvY3VzKCkge1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICB9XG5cbiAgLyoqIFRoZSB0ZXh0IGRpcmVjdGlvbiBvZiB0aGUgY29udGFpbmluZyBhcHAuICovXG4gIGdldCBkaXIoKTogRGlyZWN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5fZGlyICYmIHRoaXMuX2Rpci52YWx1ZSA9PT0gJ3J0bCcgPyAncnRsJyA6ICdsdHInO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGVuc3VyZXMgdGhhdCB0aGUgcG9wb3ZlciBjbG9zZXMgd2hlbiB0aGUgb3ZlcmxheSBiYWNrZHJvcCBpcyBjbGlja2VkLlxuICAgKiBXZSBkbyBub3QgdXNlIGZpcnN0KCkgaGVyZSBiZWNhdXNlIGRvaW5nIHNvIHdvdWxkIG5vdCBjYXRjaCBjbGlja3MgZnJvbSB3aXRoaW5cbiAgICogdGhlIHBvcG92ZXIsIGFuZCBpdCB3b3VsZCBmYWlsIHRvIHVuc3Vic2NyaWJlIHByb3Blcmx5LiBJbnN0ZWFkLCB3ZSB1bnN1YnNjcmliZVxuICAgKiBleHBsaWNpdGx5IHdoZW4gdGhlIHBvcG92ZXIgaXMgY2xvc2VkIG9yIGRlc3Ryb3llZC5cbiAgICovXG4gIHByaXZhdGUgX3N1YnNjcmliZVRvQmFja2Ryb3AoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX292ZXJsYXlSZWYpIHtcbiAgICAgIC8qKiBPbmx5IHN1YnNjcmliZSB0byBiYWNrZHJvcCBpZiB0cmlnZ2VyIGV2ZW50IGlzIGNsaWNrICovXG4gICAgICBpZiAodGhpcy50cmlnZ2VyRXZlbnQgPT09ICdjbGljaycgJiYgdGhpcy5iYWNrZHJvcENsb3NlT25DbGljayA9PT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLl9vdmVybGF5UmVmLmJhY2tkcm9wQ2xpY2soKVxuICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMucG9wb3ZlckNsb3NlZCksXG4gICAgICAgICAgICB0YWtlVW50aWwodGhpcy5fb25EZXN0cm95KSxcbiAgICAgICAgICApXG4gICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvcG92ZXIuX2VtaXRDbG9zZUV2ZW50KCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfc3Vic2NyaWJlVG9EZXRhY2htZW50cygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kZXRhY2htZW50cygpXG4gICAgICAgIC5waXBlKFxuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICB0YWtlVW50aWwodGhpcy5wb3BvdmVyQ2xvc2VkKSxcbiAgICAgICAgICB0YWtlVW50aWwodGhpcy5fb25EZXN0cm95KSxcbiAgICAgICAgKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9zZXRQb3BvdmVyQ2xvc2VkKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBzZXRzIHRoZSBwb3BvdmVyIHN0YXRlIHRvIG9wZW4gYW5kIGZvY3VzZXMgdGhlIGZpcnN0IGl0ZW0gaWZcbiAgICogdGhlIHBvcG92ZXIgd2FzIG9wZW5lZCB2aWEgdGhlIGtleWJvYXJkLlxuICAgKi9cbiAgcHJpdmF0ZSBfaW5pdFBvcG92ZXIoKTogdm9pZCB7XG4gICAgdGhpcy5fc2V0UG9wb3Zlck9wZW5lZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHJlc2V0cyB0aGUgcG9wb3ZlciB3aGVuIGl0J3MgY2xvc2VkLCBtb3N0IGltcG9ydGFudGx5IHJlc3RvcmluZ1xuICAgKiBmb2N1cyB0byB0aGUgcG9wb3ZlciB0cmlnZ2VyIGlmIHRoZSBwb3BvdmVyIHdhcyBvcGVuZWQgdmlhIHRoZSBrZXlib2FyZC5cbiAgICovXG4gIHByaXZhdGUgX3Jlc2V0UG9wb3ZlcigpOiB2b2lkIHtcbiAgICB0aGlzLl9zZXRQb3BvdmVyQ2xvc2VkKCk7XG5cbiAgICAvLyBGb2N1cyBvbmx5IG5lZWRzIHRvIGJlIHJlc2V0IHRvIHRoZSBob3N0IGVsZW1lbnQgaWYgdGhlIHBvcG92ZXIgd2FzIG9wZW5lZFxuICAgIC8vIGJ5IHRoZSBrZXlib2FyZCBhbmQgbWFudWFsbHkgc2hpZnRlZCB0byB0aGUgZmlyc3QgcG9wb3ZlciBpdGVtLlxuICAgIGlmICghdGhpcy5fb3BlbmVkQnlNb3VzZSkge1xuICAgICAgdGhpcy5mb2N1cygpO1xuICAgIH1cbiAgICB0aGlzLl9vcGVuZWRCeU1vdXNlID0gZmFsc2U7XG4gIH1cblxuICAvKiogc2V0IHN0YXRlIHJhdGhlciB0aGFuIHRvZ2dsZSB0byBzdXBwb3J0IHRyaWdnZXJzIHNoYXJpbmcgYSBwb3BvdmVyICovXG4gIHByaXZhdGUgX3NldFBvcG92ZXJPcGVuZWQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9wb3BvdmVyT3Blbikge1xuICAgICAgdGhpcy5fcG9wb3Zlck9wZW4gPSB0cnVlO1xuXG4gICAgICB0aGlzLnBvcG92ZXJPcGVuZWQubmV4dCgpO1xuICAgICAgdGhpcy5vcGVuZWQuZW1pdCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBzZXQgc3RhdGUgcmF0aGVyIHRoYW4gdG9nZ2xlIHRvIHN1cHBvcnQgdHJpZ2dlcnMgc2hhcmluZyBhIHBvcG92ZXIgKi9cbiAgcHJpdmF0ZSBfc2V0UG9wb3ZlckNsb3NlZCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fcG9wb3Zlck9wZW4pIHtcbiAgICAgIHRoaXMuX3BvcG92ZXJPcGVuID0gZmFsc2U7XG5cbiAgICAgIHRoaXMucG9wb3ZlckNsb3NlZC5uZXh0KCk7XG4gICAgICB0aGlzLmNsb3NlZC5lbWl0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBUaGlzIG1ldGhvZCBjaGVja3MgdGhhdCBhIHZhbGlkIGluc3RhbmNlIG9mIE1kUG9wb3ZlciBoYXMgYmVlbiBwYXNzZWQgaW50b1xuICAgKiAgbWRQb3BvdmVyVHJpZ2dlckZvci4gSWYgbm90LCBhbiBleGNlcHRpb24gaXMgdGhyb3duLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tQb3BvdmVyKCkge1xuICAgIGlmICghdGhpcy5wb3BvdmVyKSB7XG4gICAgICB0aHJvd01kZVBvcG92ZXJNaXNzaW5nRXJyb3IoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIFRoaXMgbWV0aG9kIGNyZWF0ZXMgdGhlIG92ZXJsYXkgZnJvbSB0aGUgcHJvdmlkZWQgcG9wb3ZlcidzIHRlbXBsYXRlIGFuZCBzYXZlcyBpdHNcbiAgICogIE92ZXJsYXlSZWYgc28gdGhhdCBpdCBjYW4gYmUgYXR0YWNoZWQgdG8gdGhlIERPTSB3aGVuIG9wZW5Qb3BvdmVyIGlzIGNhbGxlZC5cbiAgICovXG4gIHByaXZhdGUgX2NyZWF0ZU92ZXJsYXkoKTogT3ZlcmxheVJlZiB7XG4gICAgaWYgKCF0aGlzLl9vdmVybGF5UmVmKSB7XG4gICAgICB0aGlzLl9wb3J0YWwgPSBuZXcgVGVtcGxhdGVQb3J0YWwodGhpcy5wb3BvdmVyLnRlbXBsYXRlUmVmLCB0aGlzLl92aWV3Q29udGFpbmVyUmVmKTtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuX2dldE92ZXJsYXlDb25maWcoKTtcbiAgICAgIHRoaXMuX3N1YnNjcmliZVRvUG9zaXRpb25zKGNvbmZpZy5wb3NpdGlvblN0cmF0ZWd5IGFzIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSk7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmID0gdGhpcy5fb3ZlcmxheS5jcmVhdGUoY29uZmlnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fb3ZlcmxheVJlZjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBidWlsZHMgdGhlIGNvbmZpZ3VyYXRpb24gb2JqZWN0IG5lZWRlZCB0byBjcmVhdGUgdGhlIG92ZXJsYXksIHRoZSBPdmVybGF5Q29uZmlnLlxuICAgKiBAcmV0dXJucyBPdmVybGF5Q29uZmlnXG4gICAqL1xuICBwcml2YXRlIF9nZXRPdmVybGF5Q29uZmlnKCk6IE92ZXJsYXlDb25maWcge1xuICAgIGNvbnN0IG92ZXJsYXlTdGF0ZSA9IG5ldyBPdmVybGF5Q29uZmlnKCk7XG4gICAgb3ZlcmxheVN0YXRlLnBvc2l0aW9uU3RyYXRlZ3kgPSB0aGlzLl9nZXRQb3NpdGlvbigpO1xuXG4gICAgLyoqIERpc3BsYXkgb3ZlcmxheSBiYWNrZHJvcCBpZiB0cmlnZ2VyIGV2ZW50IGlzIGNsaWNrICovXG4gICAgaWYgKHRoaXMudHJpZ2dlckV2ZW50ID09PSAnY2xpY2snKSB7XG4gICAgICBvdmVybGF5U3RhdGUuaGFzQmFja2Ryb3AgPSB0cnVlO1xuICAgICAgb3ZlcmxheVN0YXRlLmJhY2tkcm9wQ2xhc3MgPSAnY2RrLW92ZXJsYXktdHJhbnNwYXJlbnQtYmFja2Ryb3AnO1xuICAgIH1cblxuICAgIG92ZXJsYXlTdGF0ZS5kaXJlY3Rpb24gPSB0aGlzLmRpcjtcbiAgICBvdmVybGF5U3RhdGUuc2Nyb2xsU3RyYXRlZ3kgPSB0aGlzLl9nZXRPdmVybGF5U2Nyb2xsU3RyYXRlZ3kodGhpcy5wb3BvdmVyLnNjcm9sbFN0cmF0ZWd5KTtcblxuICAgIHJldHVybiBvdmVybGF5U3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgc2Nyb2xsIHN0cmF0ZWd5IHVzZWQgYnkgdGhlIGNkay9vdmVybGF5LlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0T3ZlcmxheVNjcm9sbFN0cmF0ZWd5KHN0cmF0ZWd5OiBNZGVQb3BvdmVyU2Nyb2xsU3RyYXRlZ3kpOiBTY3JvbGxTdHJhdGVneSB7XG4gICAgc3dpdGNoIChzdHJhdGVneSkge1xuICAgICAgY2FzZSAnbm9vcCc6XG4gICAgICAgIHJldHVybiB0aGlzLl9vdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMubm9vcCgpO1xuICAgICAgY2FzZSAnY2xvc2UnOlxuICAgICAgICByZXR1cm4gdGhpcy5fb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLmNsb3NlKCk7XG4gICAgICBjYXNlICdibG9jayc6XG4gICAgICAgIHJldHVybiB0aGlzLl9vdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMuYmxvY2soKTtcbiAgICAgIGNhc2UgJ3JlcG9zaXRpb24nOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHRoaXMuX292ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5yZXBvc2l0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIExpc3RlbnMgdG8gY2hhbmdlcyBpbiB0aGUgcG9zaXRpb24gb2YgdGhlIG92ZXJsYXkgYW5kIHNldHMgdGhlIGNvcnJlY3QgY2xhc3Nlc1xuICAgKiBvbiB0aGUgcG9wb3ZlciBiYXNlZCBvbiB0aGUgbmV3IHBvc2l0aW9uLiBUaGlzIGVuc3VyZXMgdGhlIGFuaW1hdGlvbiBvcmlnaW4gaXMgYWx3YXlzXG4gICAqIGNvcnJlY3QsIGV2ZW4gaWYgYSBmYWxsYmFjayBwb3NpdGlvbiBpcyB1c2VkIGZvciB0aGUgb3ZlcmxheS5cbiAgICovXG4gIHByaXZhdGUgX3N1YnNjcmliZVRvUG9zaXRpb25zKHBvc2l0aW9uOiBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3kpOiB2b2lkIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgdGhpcy5fcG9zaXRpb25TdWJzY3JpcHRpb24gPSBwb3NpdGlvbi5wb3NpdGlvbkNoYW5nZXMuc3Vic2NyaWJlKGNoYW5nZSA9PiB7XG4gICAgICBjb25zdCBwb3Npc2lvblg6IE1kZVBvcG92ZXJQb3NpdGlvblggPSBjaGFuZ2UuY29ubmVjdGlvblBhaXIub3ZlcmxheVggPT09ICdzdGFydCcgPyAnYWZ0ZXInIDogJ2JlZm9yZSc7XG4gICAgICBsZXQgcG9zaXNpb25ZOiBNZGVQb3BvdmVyUG9zaXRpb25ZID0gY2hhbmdlLmNvbm5lY3Rpb25QYWlyLm92ZXJsYXlZID09PSAndG9wJyA/ICdiZWxvdycgOiAnYWJvdmUnO1xuXG4gICAgICBpZiAoIXRoaXMucG9wb3Zlci5vdmVybGFwVHJpZ2dlcikge1xuICAgICAgICBwb3Npc2lvblkgPSBwb3Npc2lvblkgPT09ICdiZWxvdycgPyAnYWJvdmUnIDogJ2JlbG93JztcbiAgICAgIH1cblxuICAgICAgLy8gcmVxdWlyZWQgZm9yIENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG5cbiAgICAgIHRoaXMucG9wb3Zlci56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgIHRoaXMucG9wb3Zlci5wb3NpdGlvblggPSBwb3Npc2lvblg7XG4gICAgICAgIHRoaXMucG9wb3Zlci5wb3NpdGlvblkgPSBwb3Npc2lvblk7XG4gICAgICAgIHRoaXMucG9wb3Zlci5zZXRDdXJyZW50U3R5bGVzKCk7XG5cbiAgICAgICAgdGhpcy5wb3BvdmVyLnNldFBvc2l0aW9uQ2xhc3Nlcyhwb3Npc2lvblgsIHBvc2lzaW9uWSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBidWlsZHMgdGhlIHBvc2l0aW9uIHN0cmF0ZWd5IGZvciB0aGUgb3ZlcmxheSwgc28gdGhlIHBvcG92ZXIgaXMgcHJvcGVybHkgY29ubmVjdGVkXG4gICAqIHRvIHRoZSB0cmlnZ2VyLlxuICAgKiBAcmV0dXJucyBDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5XG4gICAqL1xuICBwcml2YXRlIF9nZXRQb3NpdGlvbigpOiBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3kge1xuICAgIGNvbnN0IFtvcmlnaW5YLCBvcmlnaW5GYWxsYmFja1hdOiBIb3Jpem9udGFsQ29ubmVjdGlvblBvc1tdID1cbiAgICAgIHRoaXMucG9wb3Zlci5wb3NpdGlvblggPT09ICdiZWZvcmUnID8gWydlbmQnLCAnc3RhcnQnXSA6IFsnc3RhcnQnLCAnZW5kJ107XG5cbiAgICBjb25zdCBbb3ZlcmxheVksIG92ZXJsYXlGYWxsYmFja1ldOiBWZXJ0aWNhbENvbm5lY3Rpb25Qb3NbXSA9XG4gICAgICB0aGlzLnBvcG92ZXIucG9zaXRpb25ZID09PSAnYWJvdmUnID8gWydib3R0b20nLCAndG9wJ10gOiBbJ3RvcCcsICdib3R0b20nXTtcblxuICAgIC8vIGxldCBvcmlnaW5ZID0gb3ZlcmxheVk7XG4gICAgLy8gbGV0IGZhbGxiYWNrT3JpZ2luWSA9IG92ZXJsYXlGYWxsYmFja1k7XG5cbiAgICBsZXQgb3JpZ2luWSA9IG92ZXJsYXlZO1xuICAgIGxldCBvcmlnaW5GYWxsYmFja1kgPSBvdmVybGF5RmFsbGJhY2tZO1xuXG4gICAgY29uc3Qgb3ZlcmxheVggPSBvcmlnaW5YO1xuICAgIGNvbnN0IG92ZXJsYXlGYWxsYmFja1ggPSBvcmlnaW5GYWxsYmFja1g7XG5cbiAgICAvLyBsZXQgW29yaWdpblksIG9yaWdpbkZhbGxiYWNrWV0gPSBbb3ZlcmxheVksIG92ZXJsYXlGYWxsYmFja1ldO1xuICAgIC8vIGxldCBbb3ZlcmxheVgsIG92ZXJsYXlGYWxsYmFja1hdID0gW29yaWdpblgsIG9yaWdpbkZhbGxiYWNrWF07XG5cbiAgICAvKiogUmV2ZXJzZSBvdmVybGF5WSBhbmQgZmFsbGJhY2tPdmVybGF5WSB3aGVuIG92ZXJsYXBUcmlnZ2VyIGlzIGZhbHNlICovXG4gICAgaWYgKCF0aGlzLnBvcG92ZXIub3ZlcmxhcFRyaWdnZXIpIHtcbiAgICAgIG9yaWdpblkgPSBvdmVybGF5WSA9PT0gJ3RvcCcgPyAnYm90dG9tJyA6ICd0b3AnO1xuICAgICAgb3JpZ2luRmFsbGJhY2tZID0gb3ZlcmxheUZhbGxiYWNrWSA9PT0gJ3RvcCcgPyAnYm90dG9tJyA6ICd0b3AnO1xuICAgIH1cblxuICAgIGxldCBvZmZzZXRYID0gMDtcbiAgICBsZXQgb2Zmc2V0WSA9IDA7XG5cbiAgICBpZiAodGhpcy5wb3BvdmVyLnRhcmdldE9mZnNldFggJiYgIWlzTmFOKE51bWJlcih0aGlzLnBvcG92ZXIudGFyZ2V0T2Zmc2V0WCkpKSB7XG4gICAgICBvZmZzZXRYID0gTnVtYmVyKHRoaXMucG9wb3Zlci50YXJnZXRPZmZzZXRYKTtcbiAgICAgIC8vIG9mZnNldFggPSAtMTY7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucG9wb3Zlci50YXJnZXRPZmZzZXRZICYmICFpc05hTihOdW1iZXIodGhpcy5wb3BvdmVyLnRhcmdldE9mZnNldFkpKSkge1xuICAgICAgb2Zmc2V0WSA9IE51bWJlcih0aGlzLnBvcG92ZXIudGFyZ2V0T2Zmc2V0WSk7XG4gICAgICAvLyBvZmZzZXRZID0gLTEwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZvciBvdmVycmlkaW5nIHBvc2l0aW9uIGVsZW1lbnQsIHdoZW4gbWRlUG9wb3ZlclRhcmdldEF0IGhhcyBhIHZhbGlkIGVsZW1lbnQgcmVmZXJlbmNlLlxuICAgICAqIFVzZWZ1bCBmb3Igc3RpY2tpbmcgcG9wb3ZlciB0byBwYXJlbnQgZWxlbWVudCBhbmQgb2Zmc2V0dGluZyBhcnJvdyB0byB0cmlnZ2VyIGVsZW1lbnQuXG4gICAgICogSWYgdW5kZWZpbmVkIGRlZmF1bHRzIHRvIHRoZSB0cmlnZ2VyIGVsZW1lbnQgcmVmZXJlbmNlLlxuICAgICAqL1xuICAgIGxldCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZjtcbiAgICBpZiAodHlwZW9mIHRoaXMudGFyZ2V0RWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMucG9wb3Zlci5jb250YWluZXJQb3NpdGlvbmluZyA9IHRydWU7XG4gICAgICBlbGVtZW50ID0gdGhpcy50YXJnZXRFbGVtZW50Ll9lbGVtZW50UmVmO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9vdmVybGF5LnBvc2l0aW9uKClcbiAgICAgIC5mbGV4aWJsZUNvbm5lY3RlZFRvKGVsZW1lbnQpXG4gICAgICAud2l0aExvY2tlZFBvc2l0aW9uKHRydWUpXG4gICAgICAud2l0aFBvc2l0aW9ucyhbXG4gICAgICAgIHtcbiAgICAgICAgICBvcmlnaW5YLFxuICAgICAgICAgIG9yaWdpblksXG4gICAgICAgICAgb3ZlcmxheVgsXG4gICAgICAgICAgb3ZlcmxheVksXG4gICAgICAgICAgb2Zmc2V0WVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgb3JpZ2luWDogb3JpZ2luRmFsbGJhY2tYLFxuICAgICAgICAgIG9yaWdpblksXG4gICAgICAgICAgb3ZlcmxheVg6IG92ZXJsYXlGYWxsYmFja1gsXG4gICAgICAgICAgb3ZlcmxheVksXG4gICAgICAgICAgb2Zmc2V0WVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgb3JpZ2luWCxcbiAgICAgICAgICBvcmlnaW5ZOiBvcmlnaW5GYWxsYmFja1ksXG4gICAgICAgICAgb3ZlcmxheVgsXG4gICAgICAgICAgb3ZlcmxheVk6IG92ZXJsYXlGYWxsYmFja1ksXG4gICAgICAgICAgb2Zmc2V0WTogLW9mZnNldFlcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG9yaWdpblg6IG9yaWdpbkZhbGxiYWNrWCxcbiAgICAgICAgICBvcmlnaW5ZOiBvcmlnaW5GYWxsYmFja1ksXG4gICAgICAgICAgb3ZlcmxheVg6IG92ZXJsYXlGYWxsYmFja1gsXG4gICAgICAgICAgb3ZlcmxheVk6IG92ZXJsYXlGYWxsYmFja1ksXG4gICAgICAgICAgb2Zmc2V0WTogLW9mZnNldFlcbiAgICAgICAgfVxuICAgICAgXSlcbiAgICAgIC53aXRoRGVmYXVsdE9mZnNldFgob2Zmc2V0WClcbiAgICAgIC53aXRoRGVmYXVsdE9mZnNldFkob2Zmc2V0WSk7XG4gIH1cblxuICBwcml2YXRlIF9jbGVhblVwU3Vic2NyaXB0aW9ucygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fYmFja2Ryb3BTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuX2JhY2tkcm9wU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9wb3NpdGlvblN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fcG9zaXRpb25TdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2RldGFjaG1lbnRzU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9kZXRhY2htZW50c1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZG93bicsIFsnJGV2ZW50J10pIF9oYW5kbGVNb3VzZWRvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoZXZlbnQgJiYgIWlzRmFrZU1vdXNlZG93bkZyb21TY3JlZW5SZWFkZXIoZXZlbnQpKSB7XG4gICAgICB0aGlzLl9vcGVuZWRCeU1vdXNlID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==