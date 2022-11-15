enum Period {
    TEN_SECONDS = 10000,
    THIRTY_SECONDS = TEN_SECONDS * 3,
    ONE_MINUTE = TEN_SECONDS * 6,
    FIVE_MINUTES = ONE_MINUTE * 5,
    TEN_MINUTES = ONE_MINUTE * 10,
    HALF_HOUR = TEN_MINUTES * 3,
    HOUR = HALF_HOUR * 2,
    DAY = HOUR * 24,
};

export default Period;