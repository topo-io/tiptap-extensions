export declare const BASIC_CONTENT: {
    type: string;
    content: ({
        type: string;
        attrs: {
            level: number;
        };
        content: {
            type: string;
            text: string;
        }[];
    } | {
        type: string;
        content: ({
            type: string;
            text: string;
            marks?: undefined;
        } | {
            type: string;
            marks: {
                type: string;
            }[];
            text: string;
        })[];
        attrs?: undefined;
    } | {
        type: string;
        content: {
            type: string;
            content: ({
                type: string;
                content: {
                    type: string;
                    text: string;
                }[];
            } | {
                type: string;
                content: {
                    type: string;
                    content: {
                        type: string;
                        content: {
                            type: string;
                            text: string;
                        }[];
                    }[];
                }[];
            })[];
        }[];
        attrs?: undefined;
    } | {
        type: string;
        content: {
            type: string;
            content: ({
                type: string;
                text: string;
            } | {
                type: string;
                text?: undefined;
            })[];
        }[];
        attrs?: undefined;
    } | {
        type: string;
        attrs?: undefined;
        content?: undefined;
    })[];
};
