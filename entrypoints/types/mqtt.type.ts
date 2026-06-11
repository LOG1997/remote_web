export interface MqttConfigType {
    address: string;
    port: number;
    path: string;
    username?: string;
    password?: string;
    topicName: string;
}

export const AllowedAppList = {
    "bilibili": [
        'enter', "home", 'history', 'search', 'post', 'left', 'right', 'up', 'down', 'pageup', 'pagedown'
    ]
} as const

export const ALLOWED_ACTIONS = {
    'play': ['play', 'pause', 'fastForward', 'rewind', 'fullscreen'],
    'volume': ['up', 'down', 'mute'],
    'navigate': ['back', 'forward'],
    'global': ['refresh', 'nextTab', 'previousTab', 'closeTab', 'fullscreen'],
    'new': Object.keys(AllowedAppList),
    ...AllowedAppList,
} as const;

export type ValidAction = keyof typeof ALLOWED_ACTIONS | keyof typeof AllowedAppList;
export type ValidData<T extends ValidAction> = typeof ALLOWED_ACTIONS[T][number];

export interface ValidatedPayload {
    action: ValidAction;
    data: string;
    payload: string;
    timestamp: number;
}