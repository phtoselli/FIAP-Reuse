/* eslint-disable @typescript-eslint/no-explicit-any */

export const AUTH_KEY = "user-session";

export const setUser = (user: any) => {
	if (typeof window !== "undefined") {
		localStorage.setItem(AUTH_KEY, JSON.stringify(user));
	}
};

export const getUser = () => {
	if (typeof window !== "undefined") {
		const data = localStorage.getItem(AUTH_KEY);
		return data ? JSON.parse(data) : null;
	}
	return null;
};

export const clearUser = () => {
	if (typeof window !== "undefined") {
		localStorage.removeItem(AUTH_KEY);
	}
};

export function getUserId() {
	if (typeof window === "undefined") return null;

	const user = localStorage.getItem("user-session");

	if (!user) return null;

	try {
		const parsedUser = JSON.parse(user);
		return parsedUser.id;
	} catch (error) {
		return null;
	}
}
