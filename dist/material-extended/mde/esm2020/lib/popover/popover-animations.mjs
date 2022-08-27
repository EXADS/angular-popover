import { trigger, state, style, animate, transition, } from '@angular/animations';
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
export const transformPopover = trigger('transformPopover', [
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci1hbmltYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbWF0ZXJpYWwtZXh0ZW5kZWQvbWRlL3NyYy9saWIvcG9wb3Zlci9wb3BvdmVyLWFuaW1hdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLE9BQU8sRUFDUCxLQUFLLEVBQ0wsS0FBSyxFQUNMLE9BQU8sRUFDUCxVQUFVLEdBRVgsTUFBTSxxQkFBcUIsQ0FBQztBQUU3Qjs7O0dBR0c7QUFFSDs7Ozs7OztHQU9HO0FBRUgsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQTZCLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRTtJQUNwRixLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQztRQUNuQixPQUFPLEVBQUUsQ0FBQztRQUNWLFNBQVMsRUFBRSxVQUFVO0tBQ3RCLENBQUMsQ0FBQztJQUNILFVBQVUsQ0FBQyxXQUFXLEVBQUU7UUFDdEIsS0FBSyxDQUFDO1lBQ0osT0FBTyxFQUFFLENBQUM7WUFDVixTQUFTLEVBQUUsVUFBVTtTQUN0QixDQUFDO1FBQ0YsT0FBTyxDQUFDLHdDQUF3QyxDQUFDO0tBQ2xELENBQUM7SUFDRixVQUFVLENBQUMsV0FBVyxFQUFFO1FBQ3RCLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztLQUNsRCxDQUFDO0NBQ0gsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgdHJpZ2dlcixcbiAgc3RhdGUsXG4gIHN0eWxlLFxuICBhbmltYXRlLFxuICB0cmFuc2l0aW9uLFxuICBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGEsXG59IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG4vKipcbiAqIEJlbG93IGFyZSBhbGwgdGhlIGFuaW1hdGlvbnMgZm9yIHRoZSBtZC1wb3BvdmVyIGNvbXBvbmVudC5cbiAqIEFuaW1hdGlvbiBkdXJhdGlvbiBhbmQgdGltaW5nIHZhbHVlcyBhcmUgYmFzZWQgb24gQW5ndWxhckpTIE1hdGVyaWFsLlxuICovXG5cbi8qKlxuICogVGhpcyBhbmltYXRpb24gY29udHJvbHMgdGhlIHBvcG92ZXIgcGFuZWwncyBlbnRyeSBhbmQgZXhpdCBmcm9tIHRoZSBwYWdlLlxuICpcbiAqIFdoZW4gdGhlIHBvcG92ZXIgcGFuZWwgaXMgYWRkZWQgdG8gdGhlIERPTSwgaXQgc2NhbGVzIGluIGFuZCBmYWRlcyBpbiBpdHMgYm9yZGVyLlxuICpcbiAqIFdoZW4gdGhlIHBvcG92ZXIgcGFuZWwgaXMgcmVtb3ZlZCBmcm9tIHRoZSBET00sIGl0IHNpbXBseSBmYWRlcyBvdXQgYWZ0ZXIgYSBicmllZlxuICogZGVsYXkgdG8gZGlzcGxheSB0aGUgcmlwcGxlLlxuICovXG5cbmV4cG9ydCBjb25zdCB0cmFuc2Zvcm1Qb3BvdmVyOiBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGEgPSB0cmlnZ2VyKCd0cmFuc2Zvcm1Qb3BvdmVyJywgW1xuICBzdGF0ZSgnZW50ZXInLCBzdHlsZSh7XG4gICAgb3BhY2l0eTogMSxcbiAgICB0cmFuc2Zvcm06IGBzY2FsZSgxKWBcbiAgfSkpLFxuICB0cmFuc2l0aW9uKCd2b2lkID0+IConLCBbXG4gICAgc3R5bGUoe1xuICAgICAgb3BhY2l0eTogMCxcbiAgICAgIHRyYW5zZm9ybTogYHNjYWxlKDApYFxuICAgIH0pLFxuICAgIGFuaW1hdGUoYDIwMG1zIGN1YmljLWJlemllcigwLjI1LCAwLjgsIDAuMjUsIDEpYClcbiAgXSksXG4gIHRyYW5zaXRpb24oJyogPT4gdm9pZCcsIFtcbiAgICBhbmltYXRlKCc1MG1zIDEwMG1zIGxpbmVhcicsIHN0eWxlKHtvcGFjaXR5OiAwfSkpXG4gIF0pXG5dKTtcbiJdfQ==