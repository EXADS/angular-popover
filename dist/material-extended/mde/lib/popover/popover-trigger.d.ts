import { Direction, Directionality } from '@angular/cdk/bidi';
import { Overlay } from '@angular/cdk/overlay';
import { AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, OnDestroy, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { MdePopoverPanel, MdeTarget } from './popover-interfaces';
import { MdePopoverPositionX, MdePopoverPositionY, MdePopoverTriggerEvent } from './popover-types';
import * as i0 from "@angular/core";
/**
 * This directive is intended to be used in conjunction with an mde-popover tag. It is
 * responsible for toggling the display of the provided popover instance.
 */
export declare class MdePopoverTrigger implements AfterViewInit, OnDestroy {
    private _overlay;
    _elementRef: ElementRef;
    private _viewContainerRef;
    private _dir;
    private _changeDetectorRef;
    ariaHaspopup: boolean;
    popoverOpened: Subject<void>;
    popoverClosed: Subject<void>;
    private _portal;
    private _overlayRef;
    private _popoverOpen;
    private _halt;
    private _backdropSubscription;
    private _positionSubscription;
    private _detachmentsSubscription;
    private _mouseoverTimer;
    private _openedByMouse;
    private _onDestroy;
    /** References the popover instance that the trigger is associated with. */
    popover: MdePopoverPanel;
    /** References the popover target instance that the trigger is associated with. */
    targetElement: MdeTarget;
    /** Position of the popover in the X axis */
    positionX: MdePopoverPositionX;
    /** Position of the popover in the Y axis */
    positionY: MdePopoverPositionY;
    /** Popover trigger event */
    triggerEvent: MdePopoverTriggerEvent;
    /** Popover delay */
    enterDelay: number;
    /** Popover delay */
    leaveDelay: number;
    /** Popover overlap trigger */
    overlapTrigger: boolean;
    /** Popover target offset x */
    targetOffsetX: number;
    /** Popover target offset y */
    targetOffsetY: number;
    /** Popover arrow offset x */
    arrowOffsetX: number;
    /** Popover arrow width */
    arrowWidth: number;
    /** Popover arrow color */
    arrowColor: string;
    /** Popover container close on click */
    closeOnClick: boolean;
    /** Popover backdrop close on click */
    backdropCloseOnClick: boolean;
    /** Event emitted when the associated popover is opened. */
    opened: EventEmitter<void>;
    /** Event emitted when the associated popover is closed. */
    closed: EventEmitter<void>;
    constructor(_overlay: Overlay, _elementRef: ElementRef, _viewContainerRef: ViewContainerRef, _dir: Directionality, _changeDetectorRef: ChangeDetectorRef);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    private _setCurrentConfig;
    /** Whether the popover is open. */
    get popoverOpen(): boolean;
    onClick(_event: MouseEvent): void;
    onMouseEnter(_event: MouseEvent): void;
    onMouseLeave(_event: MouseEvent): void;
    /** Toggles the popover between the open and closed states. */
    togglePopover(): void;
    /** Opens the popover. */
    openPopover(): void;
    /** Closes the popover. */
    closePopover(): void;
    /** Removes the popover from the DOM. */
    destroyPopover(): void;
    /** Focuses the popover trigger. */
    focus(): void;
    /** The text direction of the containing app. */
    get dir(): Direction;
    /**
     * This method ensures that the popover closes when the overlay backdrop is clicked.
     * We do not use first() here because doing so would not catch clicks from within
     * the popover, and it would fail to unsubscribe properly. Instead, we unsubscribe
     * explicitly when the popover is closed or destroyed.
     */
    private _subscribeToBackdrop;
    private _subscribeToDetachments;
    /**
     * This method sets the popover state to open and focuses the first item if
     * the popover was opened via the keyboard.
     */
    private _initPopover;
    /**
     * This method resets the popover when it's closed, most importantly restoring
     * focus to the popover trigger if the popover was opened via the keyboard.
     */
    private _resetPopover;
    /** set state rather than toggle to support triggers sharing a popover */
    private _setPopoverOpened;
    /** set state rather than toggle to support triggers sharing a popover */
    private _setPopoverClosed;
    /**
     *  This method checks that a valid instance of MdPopover has been passed into
     *  mdPopoverTriggerFor. If not, an exception is thrown.
     */
    private _checkPopover;
    /**
     *  This method creates the overlay from the provided popover's template and saves its
     *  OverlayRef so that it can be attached to the DOM when openPopover is called.
     */
    private _createOverlay;
    /**
     * This method builds the configuration object needed to create the overlay, the OverlayConfig.
     * @returns OverlayConfig
     */
    private _getOverlayConfig;
    /**
     * This method returns the scroll strategy used by the cdk/overlay.
     */
    private _getOverlayScrollStrategy;
    /**
     * Listens to changes in the position of the overlay and sets the correct classes
     * on the popover based on the new position. This ensures the animation origin is always
     * correct, even if a fallback position is used for the overlay.
     */
    private _subscribeToPositions;
    /**
     * This method builds the position strategy for the overlay, so the popover is properly connected
     * to the trigger.
     * @returns ConnectedPositionStrategy
     */
    private _getPosition;
    private _cleanUpSubscriptions;
    _handleMousedown(event: MouseEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MdePopoverTrigger, [null, null, null, { optional: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MdePopoverTrigger, "[mdePopoverTriggerFor]", ["mdePopoverTrigger"], { "popover": "mdePopoverTriggerFor"; "targetElement": "mdePopoverTargetAt"; "positionX": "mdePopoverPositionX"; "positionY": "mdePopoverPositionY"; "triggerEvent": "mdePopoverTriggerOn"; "enterDelay": "mdePopoverEnterDelay"; "leaveDelay": "mdePopoverLeaveDelay"; "overlapTrigger": "mdePopoverOverlapTrigger"; "targetOffsetX": "mdePopoverOffsetX"; "targetOffsetY": "mdePopoverOffsetY"; "arrowOffsetX": "mdePopoverArrowOffsetX"; "arrowWidth": "mdePopoverArrowWidth"; "arrowColor": "mdePopoverArrowColor"; "closeOnClick": "mdePopoverCloseOnClick"; "backdropCloseOnClick": "mdePopoverBackdropCloseOnClick"; }, { "opened": "opened"; "closed": "closed"; }, never>;
}
