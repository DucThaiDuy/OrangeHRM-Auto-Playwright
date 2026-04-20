export class Logger {
    static info(message: string) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] INFO: ${message}`);
    }

    static error(message: string, error?: any) {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] ERROR: ${message}`, error || '');
    }

    static testStep(stepName: string) {
        console.log(`\n>>> STEP: ${stepName}`);
    }
}
