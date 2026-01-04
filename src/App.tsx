import { Fragment } from 'preact';
import { Router } from './router/Router';
import { ThemeProvider } from './context/ThemeContext';

export function App() {
    return (
        <ThemeProvider>
            <Fragment>
                <Router />
            </Fragment>
        </ThemeProvider>
    );
}
