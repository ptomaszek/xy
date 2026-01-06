// Custom KaTeX component that uses globally loaded KaTeX from CDN
import React from 'react';

/**
 * KaTeXComponents - Custom component for rendering mathematical expressions
 * Uses globally loaded KaTeX from CDN (via HTML script tag)
 * 
 * @param {Object} props
 * @param {string} props.math - The LaTeX math expression to render
 * @param {Object} props.style - Optional style object for the container
 * @returns {React.ReactElement}
 */
const KaTeXComponents = ({ math, style }) => {
    // Check if KaTeX is loaded globally (from CDN)
    if (typeof window === 'undefined' || !window.katex) {
        // Fallback to plain text if KaTeX not loaded
        return <span style={style}>{math}</span>;
    }

    try {
        // Use KaTeX's renderToString for server-side rendering
        return (
            <span
                style={style}
                dangerouslySetInnerHTML={{
                    __html: window.katex.renderToString(math, {
                        displayMode: false,
                        throwOnError: false
                    })
                }}
            />
        );
    } catch (error) {
        console.warn('KaTeX rendering failed:', error);
        // Fallback to plain text if rendering fails
        return <span style={style}>{math}</span>;
    }
};

export default KaTeXComponents;
