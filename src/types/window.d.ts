/**
 * Type definitions for window globals
 */

import { Application } from '../application';

declare global {
    interface Window {
        KleeApplication: typeof Application;
    }
}

export {};

