/**
 *
 * Scroll element into viewport ([MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)).
 *
 * <example>
    :scrollIntoView.js
    it('should demonstrate the scrollIntoView command', async () => {
        const elem = await $('#myElement');
        // scroll to specific element
        await elem.scrollIntoView();
        // center element within the viewport
        await elem.scrollIntoView({ block: 'center', inline: 'center' });
    });
 * </example>
 *
 * @alias element.scrollIntoView
 * @param {object|boolean=} scrollIntoViewOptions  options for `Element.scrollIntoView()` (default: `{ block: 'start', inline: 'nearest' }`)
 * @uses protocol/execute
 * @type utility
 *
 */
export declare function scrollIntoView(this: WebdriverIO.Element, options?: ScrollIntoViewOptions | boolean): Promise<void>;
//# sourceMappingURL=scrollIntoView.d.ts.map