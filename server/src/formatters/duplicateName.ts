function DuplicateName(names: string[], name: string): string {
  const patt = new RegExp(`^${name}_*$`);
  names = names.filter((name: string): boolean => patt.test(name));

  // Prepare duplicated scenario name
  const longestName: string = names.reduce((a: string, b: string): string => (a.length > b.length ? a : b), '');
  const endCharacters: number = longestName.slice(name.length).length + 1;
  for (let i = 0; i < endCharacters; i++) {
    name += '_';
  }
  return name;
}
export default DuplicateName;
