export const visibleDatesReducer = (state = [100, 100], action: any) => {
  switch (action.type) {
    case "CHANGEDOMAIN":
      return state.map((x) => x + 1);

    default:
      return state;
  }
};
