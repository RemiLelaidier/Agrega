import { RxJsonSchema }  from 'rxdb';

export const category: RxJsonSchema = {
    description: "Category description",
    version: 0,
    title: "category",
    type: "object",
    properties: {
        id: { type: "string", primary: true },
        name: { type: "string" },
        description: { type: "string" },
        color: { type: "string" },
        ressources: {
            type: "array",
            uniqueItems: true,
            items: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                    url: { type: "string" },
                    added: { type: "string" }
                },
                required: ['name', 'url']
            }
        },
    },
    required: ['name', 'color']
}