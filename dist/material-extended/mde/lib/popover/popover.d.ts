import { EventEmitter, OnDestroy, TemplateRef, ElementRef, NgZone } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { MdePopoverPositionX, MdePopoverPositionY, MdePopoverTriggerEvent, MdePopoverScrollStrategy } from './popover-types';
import { MdePopoverPanel } from './popover-interfaces';
import * as i0 from "@angular/core";
export declare class MdePopover implements MdePopoverPanel, OnDestroy {
    private _elementRef;
    zone: NgZone;
    role: string;
    /** Settings for popover, view setters and getters for more detail */
    private _positionX;
    private _positionY;
    private _triggerEvent;
    private _scrollStrategy;
    private _enterDelay;
    private _leaveDelay;
    private _overlapTrigger;
    private _disableAnimation;
    private _targetOffsetX;
    private _targetOffsetY;
    private _arrowOffsetX;
    private _arrowWidth;
    private _arrowColor;
    private _closeOnClick;
    private _focusTrapEnabled;
    private _focusTrapAutoCaptureEnabled;
    /** Config object to be passed into the popover's ngClass */
    _classList: {
        [key: string]: boolean;
    };
    /** */
    containerPositioning: boolean;
    /** Closing disabled on popover */
    closeDisabled: boolean;
    /** Config object to be passed into the popover's arrow ngStyle */
    popoverPanelStyles: {};
    /** Config object to be passed into the popover's arrow ngStyle */
    popoverArrowStyles: {};
    /** Config object to be passed into the popover's content ngStyle */
    popoverContentStyles: {};
    /** Emits the current animation state whenever it changes. */
    _onAnimationStateChange: EventEmitter<AnimationEvent>;
    /** Position of the popover in the X axis. */
    get positionX(): MdePopoverPositionX;
    set positionX(value: MdePopoverPositionX);
    /** Position of the popover in the Y axis. */
    get positionY(): MdePopoverPositionY;
    set positionY(value: MdePopoverPositionY);
    /** Popover trigger event */
    get triggerEvent(): MdePopoverTriggerEvent;
    set triggerEvent(value: MdePopoverTriggerEvent);
    /** Popover scroll strategy */
    get scrollStrategy(): MdePopoverScrollStrategy;
    set scrollStrategy(value: MdePopoverScrollStrategy);
    /** Popover enter delay */
    get enterDelay(): number;
    set enterDelay(value: number);
    /** Popover leave delay */
    get leaveDelay(): number;
    set leaveDelay(value: number);
    /** Popover overlap trigger */
    get overlapTrigger(): boolean;
    set overlapTrigger(value: boolean);
    /** Popover target offset x */
    get targetOffsetX(): number;
    set targetOffsetX(value: number);
    /** Popover target offset y */
    get targetOffsetY(): number;
    set targetOffsetY(value: number);
    /** Popover arrow offset x */
    get arrowOffsetX(): number;
    set arrowOffsetX(value: number);
    /** Popover arrow width */
    get arrowWidth(): number;
    set arrowWidth(value: number);
    /** Popover arrow color */
    get arrowColor(): string;
    set arrowColor(value: string);
    /**
     * Popover container close on click
     * default: true
     */
    get closeOnClick(): boolean;
    set closeOnClick(value: boolean);
    /**
     * Disable animations of popover and all child elements
     * default: false
     */
    get disableAnimation(): boolean;
    set disableAnimation(value: boolean);
    /**
     * Popover focus trap using cdkTrapFocus
     * default: true
     */
    get focusTrapEnabled(): boolean;
    set focusTrapEnabled(value: boolean);
    /**
     * Popover focus trap auto capture using cdkTrapFocusAutoCapture
     * default: true
     */
    get focusTrapAutoCaptureEnabled(): boolean;
    set focusTrapAutoCaptureEnabled(value: boolean);
    /**
     * This method takes classes set on the host md-popover element and applies them on the
     * popover template that displays in the overlay container.  Otherwise, it's difficult
     * to style the containing popover from outside the component.
     * @param classes list of class names
     */
    set panelClass(classes: string);
    /**
     * This method takes classes set on the host md-popover element and applies them on the
     * popover template that displays in the overlay container.  Otherwise, it's difficult
     * to style the containing popover from outside the component.
     * @deprecated Use `panelClass` instead.
     */
    get classList(): string;
    set classList(classes: string);
    /** Event emitted when the popover is closed. */
    close: EventEmitter<void>;
    templateRef: TemplateRef<any>;
    constructor(_elementRef: ElementRef, zone: NgZone);
    ngOnDestroy(): void;
    /** Handle a keyboard event from the popover, delegating to the appropriate action. */
    _handleKeydown(event: KeyboardEvent): void;
    /**
     * This emits a close event to which the trigger is subscribed. When emitted, the
     * trigger will close the popover.
     */
    _emitCloseEvent(): void;
    /** Close popover on click if closeOnClick is true */
    onClick(): void;
    /**
     * TODO: Refactor when @angular/cdk includes feature I mentioned on github see link below.
     * https://github.com/angular/material2/pull/5493#issuecomment-313085323
     */
    /** Disables close of popover when leaving trigger element and mouse over the popover */
    onMouseOver(): void;
    /** Enables close of popover when mouse leaving popover element */
    onMouseLeave(): void;
    /** Sets the current styles for the popover to allow for dynamically changing settings */
    setCurrentStyles(): void;
    /**
     * It's necessary to set position-based classes to ensure the popover panel animation
     * folds out from the correct direction.
     */
    setPositionClasses(posX?: MdePopoverPositionX, posY?: MdePopoverPositionY): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MdePopover, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MdePopover, "mde-popover", ["mdePopover"], { "positionX": "mdePopoverPositionX"; "positionY": "mdePopoverPositionY"; "triggerEvent": "mdePopoverTriggerOn"; "scrollStrategy": "mdePopoverScrollStrategy"; "enterDelay": "mdePopoverEnterDelay"; "leaveDelay": "mdePopoverLeaveDelay"; "overlapTrigger": "mdePopoverOverlapTrigger"; "targetOffsetX": "mdePopoverOffsetX"; "targetOffsetY": "mdePopoverOffsetY"; "arrowOffsetX": "mdePopoverArrowOffsetX"; "arrowWidth": "mdePopoverArrowWidth"; "arrowColor": "mdePopoverArrowColor"; "closeOnClick": "mdePopoverCloseOnClick"; "disableAnimation": "mdePopoverDisableAnimation"; "focusTrapEnabled": "mdeFocusTrapEnabled"; "focusTrapAutoCaptureEnabled": "mdeFocusTrapAutoCaptureEnabled"; "panelClass": "class"; "classList": "classList"; }, { "close": "close"; }, never, ["*"]>;
}
