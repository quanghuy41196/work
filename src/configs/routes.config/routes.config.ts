import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const protectedRoutes: Routes = {
    '/tin-nhan': {
        key: 'tin-nhan',
        authority: [],
        meta: { layout: 'blank', pageContainerType: 'gutterless', footer: false },
    },
    '/nhom': {
        key: 'nhom',
        authority: [],
        meta: { layout: 'blank', pageContainerType: 'gutterless', footer: false },
    },
    '/tao-nhom': {
        key: 'tao-nhom',
        authority: [],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    '/bang-tin': {
        key: 'bang-tin',
        authority: [],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    '/dashboard': {
        key: 'dashboard',
        authority: [],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    '/lich': {
        key: 'lich',
        authority: [],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    '/nhiem-vu': {
        key: 'nhiem-vu',
        authority: [],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    '/ghi-chu': {
        key: 'ghi-chu',
        authority: [],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
}

export const publicRoutes: Routes = {
    // '/home': {
    //     key: '',
    //     authority: [],
    //     meta: {
    //         pageBackgroundType: 'plain',
    //         pageContainerType: 'contained',
    //     },
    // },
}

export const authRoutes = authRoute
