import * as i0 from '@angular/core';
import { EventEmitter, TemplateRef, Component, ChangeDetectionStrategy, ViewEncapsulation, HostBinding, Input, Output, ViewChild, Directive, Optional, HostListener, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i1$1 from '@angular/cdk/overlay';
import { OverlayConfig, OverlayModule } from '@angular/cdk/overlay';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE } from '@angular/cdk/keycodes';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as i2 from '@angular/cdk/a11y';
import { isFakeMousedownFromScreenReader, A11yModule } from '@angular/cdk/a11y';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as i2$1 from '@angular/cdk/bidi';

/**
 * Throws an exception for the case when popover trigger doesn't have a valid mde-popover instance
 */
function throwMdePopoverMissingError() {
    throw Error(`mde-popover-trigger: must pass in an mde-popover instance.

    Example:
      <mde-popover #popover="mdePopover"></mde-popover>
      <button [mdePopoverTriggerFor]="popover"></button>`);
}
/**
 * Throws an exception for the case when popover's mdePopoverPositionX value isn't valid.
 * In other words, it doesn't match 'before' or 'after'.
 */
function throwMdePopoverInvalidPositionX() {
    throw Error(`mdePopoverPositionX value must be either 'before' or after'.
      Example: <mde-popover mdePopoverPositionX="before" #popover="mdePopover"></mde-popover>`);
}
/**
 * Throws an exception for the case when popover's mdePopoverPositionY value isn't valid.
 * In other words, it doesn't match 'above' or 'below'.
 */
function throwMdePopoverInvalidPositionY() {
    throw Error(`mdePopoverPositionY value must be either 'above' or below'.
      Example: <mde-popover mdePopoverPositionY="above" #popover="mdePopover"></mde-popover>`);
}

/**
 * Below are all the animations for the md-popover component.
 * Animation duration and timing values are based on AngularJS Material.
 */
/**
 * This animation controls the popover panel's entry and exit from the page.
 *
 * When the popover panel is added to the DOM, it scales in and fades in its border.
 *
 * When the popover panel is removed from the DOM, it simply fades out after a brief
 * delay to display the ripple.
 */
const transformPopover = trigger('transformPopover', [
    state('enter', style({
        opacity: 1,
        transform: `scale(1)`
    })),
    transition('void => *', [
        style({
            opacity: 0,
            transform: `scale(0)`
        }),
        animate(`200ms cubic-bezier(0.25, 0.8, 0.25, 1)`)
    ]),
    transition('* => void', [
        animate('50ms 100ms linear', style({ opacity: 0 }))
    ])
]);

class MdePopover {
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

/**
 * This directive is intended to be used in conjunction with an mde-popover tag. It is
 * responsible for toggling the display of the provided popover instance.
 */
class MdePopoverTrigger {
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
MdePopoverTrigger.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: MdePopoverTrigger, deps: [{ token: i1$1.Overlay }, { token: i0.ElementRef }, { token: i0.ViewContainerRef }, { token: i2$1.Directionality, optional: true }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
MdePopoverTrigger.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.11", type: MdePopoverTrigger, selector: "[mdePopoverTriggerFor]", inputs: { popover: ["mdePopoverTriggerFor", "popover"], targetElement: ["mdePopoverTargetAt", "targetElement"], positionX: ["mdePopoverPositionX", "positionX"], positionY: ["mdePopoverPositionY", "positionY"], triggerEvent: ["mdePopoverTriggerOn", "triggerEvent"], enterDelay: ["mdePopoverEnterDelay", "enterDelay"], leaveDelay: ["mdePopoverLeaveDelay", "leaveDelay"], overlapTrigger: ["mdePopoverOverlapTrigger", "overlapTrigger"], targetOffsetX: ["mdePopoverOffsetX", "targetOffsetX"], targetOffsetY: ["mdePopoverOffsetY", "targetOffsetY"], arrowOffsetX: ["mdePopoverArrowOffsetX", "arrowOffsetX"], arrowWidth: ["mdePopoverArrowWidth", "arrowWidth"], arrowColor: ["mdePopoverArrowColor", "arrowColor"], closeOnClick: ["mdePopoverCloseOnClick", "closeOnClick"], backdropCloseOnClick: ["mdePopoverBackdropCloseOnClick", "backdropCloseOnClick"] }, outputs: { opened: "opened", closed: "closed" }, host: { listeners: { "click": "onClick($event)", "mouseenter": "onMouseEnter($event)", "mouseleave": "onMouseLeave($event)", "mousedown": "_handleMousedown($event)" }, properties: { "attr.aria-haspopup": "this.ariaHaspopup" } }, exportAs: ["mdePopoverTrigger"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: MdePopoverTrigger, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mdePopoverTriggerFor]',
                    exportAs: 'mdePopoverTrigger'
                }]
        }], ctorParameters: function () { return [{ type: i1$1.Overlay }, { type: i0.ElementRef }, { type: i0.ViewContainerRef }, { type: i2$1.Directionality, decorators: [{
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

class MdePopoverTarget {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
MdePopoverTarget.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: MdePopoverTarget, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
MdePopoverTarget.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.11", type: MdePopoverTarget, selector: "mde-popover-target, [mdePopoverTarget]", exportAs: ["mdePopoverTarget"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: MdePopoverTarget, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mde-popover-target, [mdePopoverTarget]',
                    exportAs: 'mdePopoverTarget'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; } });

class MdePopoverModule {
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

/*
 * Public API Surface of mde
 */

/**
 * Generated bundle index. Do not edit.
 */

export { MdePopover, MdePopoverModule, MdePopoverTarget, MdePopoverTrigger, transformPopover };
//# sourceMappingURL=angular-popover.mjs.map
