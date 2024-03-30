const platforms = ['browser', 'neutral', 'node'] as const;
export type Platform = (typeof platforms)[number];

export function isPlatform(x:unknown):x is Platform {
    
    // @ts-ignore
    if( x===undefined || (typeof x==='string' && platforms.includes(x)) ) {
        return true;
    }
    return false;
}