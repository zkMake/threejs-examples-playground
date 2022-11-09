const MODE_DEV = (() => process.env.NODE_ENV === "development")();
const MODE_PROD = (() => process.env.NODE_ENV === "production")();

export { MODE_DEV, MODE_PROD };
