export interface Game {
    _id?: string,
    status: string,
    word: string,
    guesses: string[],
    createdAt?: string,
}

export interface Guesses {
    1: number,
    2: number,
    3: number,
    4: number,
    5: number,
    6: number,
}

export interface Letters {
    a: boolean,
    b: boolean,
    c: boolean,
    d: boolean,
    e: boolean,
    f: boolean,
    g: boolean,
    h: boolean,
    i: boolean,
    j: boolean,
    k: boolean,
    l: boolean,
    m: boolean,
    n: boolean,
    o: boolean,
    p: boolean,
    q: boolean,
    r: boolean,
    s: boolean,
    t: boolean,
    u: boolean,
    v: boolean,
    w: boolean,
    x: boolean,
    y: boolean,
    z: boolean,
};
