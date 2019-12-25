export default interface IOpenNote {
  participants: {
    [key: string]: {
      name: string;
      hash: string;
      count: number;
    };
  };
}
