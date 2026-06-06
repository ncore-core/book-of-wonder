/* tslint:disable */
/* eslint-disable */

export class PagePhysics {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    get_page_size(): Float32Array;
    get_segments(): Uint32Array;
    get_vertex_count(): number;
    /**
     * Get vertex positions as flat [x, y, z, x, y, z, ...]
     */
    get_vertices(): Float32Array;
    static new(width_segments: number, height_segments: number, page_width: number, page_height: number): PagePhysics;
    set_damping(d: number): void;
    /**
     * Set grab point — pass (None, None, None) to release
     */
    set_grab_point(x?: number | null, y?: number | null, z?: number | null): void;
    set_gravity(g: number): void;
    set_stiffness(s: number): void;
    set_wind(w: number): void;
    /**
     * Step physics simulation by dt seconds
     */
    step(dt: number): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_pagephysics_free: (a: number, b: number) => void;
    readonly pagephysics_get_page_size: (a: number) => [number, number];
    readonly pagephysics_get_segments: (a: number) => [number, number];
    readonly pagephysics_get_vertex_count: (a: number) => number;
    readonly pagephysics_get_vertices: (a: number) => [number, number];
    readonly pagephysics_new: (a: number, b: number, c: number, d: number) => number;
    readonly pagephysics_set_damping: (a: number, b: number) => void;
    readonly pagephysics_set_grab_point: (a: number, b: number, c: number, d: number) => void;
    readonly pagephysics_set_gravity: (a: number, b: number) => void;
    readonly pagephysics_set_stiffness: (a: number, b: number) => void;
    readonly pagephysics_set_wind: (a: number, b: number) => void;
    readonly pagephysics_step: (a: number, b: number) => void;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
