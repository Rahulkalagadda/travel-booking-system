import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

interface UIState {
    sidebarOpen: boolean;
    theme: 'light' | 'dark' | 'system';
    toasts: Toast[];
    modals: {
        loginOpen: boolean;
        bookingOpen: boolean;
        filtersOpen: boolean;
    };
    loading: {
        global: boolean;
        page: boolean;
    };
}

const initialState: UIState = {
    sidebarOpen: false,
    theme: 'system',
    toasts: [],
    modals: {
        loginOpen: false,
        bookingOpen: false,
        filtersOpen: false,
    },
    loading: {
        global: false,
        page: false,
    },
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.sidebarOpen = action.payload;
        },
        setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
            state.theme = action.payload;
        },
        addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
            const id = Date.now().toString();
            state.toasts.push({ ...action.payload, id });
        },
        removeToast: (state, action: PayloadAction<string>) => {
            state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
        },
        clearToasts: (state) => {
            state.toasts = [];
        },
        openModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
            state.modals[action.payload] = true;
        },
        closeModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
            state.modals[action.payload] = false;
        },
        setGlobalLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.global = action.payload;
        },
        setPageLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.page = action.payload;
        },
    },
});

export const {
    toggleSidebar,
    setSidebarOpen,
    setTheme,
    addToast,
    removeToast,
    clearToasts,
    openModal,
    closeModal,
    setGlobalLoading,
    setPageLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
