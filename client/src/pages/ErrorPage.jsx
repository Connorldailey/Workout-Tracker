import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

// Define and export ErrorPage component
export default function ErrorPage() {
    const error = useRouteError();

    // Render error page for route errors
    if (isRouteErrorResponse(error)) {
        return (
            <div id="error-page">
                <h1>Oops!</h1>
                <p>Sorry, an unexpected error has occurred.</p>
                <p>
                    <i>{error.statusText || error.data}</i>
                </p>
            </div>
        );
    }

    console.error(error);

    // Render error page with user-friendly message and error details
    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error instanceof Error ? error.message : 'Unknown error occurred'}</i>
            </p>
        </div>
    );
}