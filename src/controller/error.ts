import { Response } from "express";

export class ErrorResponse {
    public code: number;
    private err: string[];
    private data: { [key: string]: any } | null;

    public constructor(code: number = 500) {
        this.code = code;
        this.err = [];
        this.data = null
    }

    public add_err(err: string): ErrorResponse {
        this.err.push(err);
        return this;
    }

    public add_data(tag: string, data: any): ErrorResponse {
        if (this.data === null) {
            this.data = {};
        }

        this.data[tag] = data;
        return this;
    }

    public send(response: Response) {
        response.json({ 'err': this.err, 'data': this.data })
            .status(this.code).end();
    }
}