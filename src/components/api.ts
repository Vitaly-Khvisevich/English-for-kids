export const baseURL = 'https://immense-crag-05554.herokuapp.com';

export const api = `${baseURL}/api`;

export const getAll = async (): Promise<
  (string[] | { word: string; translation: string; image: string; audioSrc: string }[])[]
> => {
  const response = await fetch(`${api}/getAll`);
  const infoAll = await response.json();
  return infoAll;
};

export const getRouts = async (): Promise<string[]> => {
  const response = await fetch(`${api}/routs`);
  const infoRouts = await response.json();
  return infoRouts;
};

export const categoriesGeneral = async (): Promise<
  Array<{ index: number; categoryName: string; countWords: number; hash: string; src: string }>
> => {
  const response = await fetch(`${api}/categories`);
  const categories = await response.json();
  return categories;
};

export const getWords = async (
  category: string
): Promise<{ word: string; translation: string; image: string; audioSrc: string }[]> => {
  const response = await fetch(`${api}/${category}/words`);
  const words = await response.json();
  return words;
};

export const changeCategory = async (oldName: string, newName: string): Promise<void> => {
  const data = {
    old_name: oldName,
    new_name: newName,
  };
  await fetch(`${api}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const addRout = async (newName: string): Promise<void> => {
  const data = {
    newRout: newName,
  };
  await fetch(`${api}/routs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const deleteCategory = async (delete_name: string): Promise<void> => {
  const data = {
    category_name: delete_name,
  };
  await fetch(`${api}/categories`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const addNewCategory = async (
  formData: HTMLFormElement
): Promise<{ index: number; name: string; count: number }> => {
  const data = new FormData(formData);
  const response = await fetch(`${api}/newCategory`, {
    method: 'POST',
    body: data,
  });
  const newCategory = await response.json();
  return newCategory;
};

export const deleteWord = async (delete_name: string, category: string): Promise<void> => {
  const data = {
    word_name: delete_name,
    category_name: category,
  };
  await fetch(`${api}/word`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const addNewWord = async (formData: HTMLFormElement, categoryTitle: string): Promise<void> => {
  const data = new FormData(formData);
  data.append('Category', categoryTitle);
  await fetch(`${api}/word`, {
    method: 'POST',
    body: data,
  });
};

export const changeWord = async (formData: HTMLFormElement, categoryTitle: string, oldName: string): Promise<void> => {
  const data = new FormData(formData);
  data.append('Category', categoryTitle);
  data.append('OldName', oldName);
  await fetch(`${api}/changeWord`, {
    method: 'POST',
    body: data,
  });
};
