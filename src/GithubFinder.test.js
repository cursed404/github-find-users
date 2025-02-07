import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GithubFinder from './GithubFinder';

// Мокаем функцию fetch для эмуляции ответа от githubAPI
global.fetch = jest.fn();

describe('GithubFinder', () => {
  // тест отображения компонента без ошибок
  test('компонент рендерится без ошибок', () => {
    render(<GithubFinder />); 
    const inputElement = screen.getByPlaceholderText(/Введите имя пользователя/i); 
    expect(inputElement).toBeInTheDocument(); 
  });

  // тест обработки ввода текста
  test('обрабатывает ввод имени пользователя', () => {
    render(<GithubFinder />);
    const inputElement = screen.getByPlaceholderText(/Введите имя пользователя/i); 
    fireEvent.change(inputElement, { target: { value: 'cursed404' } }); 
    expect(inputElement.value).toBe('cursed404'); // 
  });

  // Тестируем отоборажение ошибки если пользователь не найден
  test('показывает ошибку при некорректном имени пользователя', async () => {
    // Мокаем fetch для возврата ошибки 
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ message: 'не найден' }),
    });

    render(<GithubFinder />); // Рендерим компонент
    const inputElement = screen.getByPlaceholderText(/Введите имя пользователя/i);
    fireEvent.change(inputElement, { target: { value: 'testusernotfoundnenaiden123' } }); // вводим несуществующее имя пользователя

    const button = screen.getByText(/Искать/i); 
    fireEvent.click(button); 

    // Ждём появления сообщения об ошибке
    await waitFor(() => screen.getByText(/Пользователь не найден/));
    expect(screen.getByText(/Пользователь не найден/)).toBeInTheDocument(); // проверяем отображение ошибки
  });

  // Тестирование правильного отображения репозитория при валдином имени пользователя
  test('показывает репозитории при корректном имени пользователя', async () => {
    // мокаем успешный ответ от fetch с репозиториями
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve([
        {
          id: 1,
          name: 'repo-1',
          description: 'Description of repo 1',
          stargazers_count: 10,
          html_url: 'https://github.com/test-user/repo-1',
        }
      ]),
    });

    render(<GithubFinder />); // Рендерим компонент
    const inputElement = screen.getByPlaceholderText(/Введите имя пользователя GitHub/i); 
    fireEvent.change(inputElement, { target: { value: 'cursed404' } }); // вводим правильное имя пользователя

    const button = screen.getByText(/Искать/i); 
    fireEvent.click(button);

    // ожидание отображения репозитория 
    await waitFor(() => screen.getByText('repo-1'));
    expect(screen.getByText('repo-1')).toBeInTheDocument(); // проверка отображения названия
    expect(screen.getByText('Description of repo 1')).toBeInTheDocument(); // проверка отображения описания 
    expect(screen.getByText('Test: 10')).toBeInTheDocument(); // Ппровекра кол-ва тестов
  });

  // отобраэение индикатора загрузки
  test('показывает индикатор загрузки', () => {
    // мокаем задержку в fetch, чтобы посмотреть на индикатр загрузки
    fetch.mockResolvedValueOnce({
      json: () => new Promise((resolve) => setTimeout(() => resolve([]), 1000)), // Эмулируем задержку
    });

    render(<GithubFinder />); 
    const inputElement = screen.getByPlaceholderText(/Введите имя пользователя/i); 
    fireEvent.change(inputElement, { target: { value: 'cursed404' } }); 

    const button = screen.getByText(/Искать/i);
    fireEvent.click(button); 

    // Проверяем, что индикатор загрузки появился
    expect(screen.getByText(/Загрузка.../i)).toBeInTheDocument();
  });
});
