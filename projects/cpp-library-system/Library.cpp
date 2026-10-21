// Library.cpp — a small library catalogue that survives between runs.
//
// A console menu for adding, searching, borrowing, and returning books.
// The catalogue is saved to library.txt, so it is still there next time.
//
// Build and run:
//   g++ -std=c++17 -O2 -o library Library.cpp
//   ./library

#include <algorithm>
#include <cctype>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

struct Book {
    int id = 0;
    std::string title;
    std::string author;
    bool borrowed = false;
};

static std::vector<Book> catalogue;
static int nextId = 1;

static std::string lower(std::string text) {
    std::transform(text.begin(), text.end(), text.begin(),
                   [](unsigned char c) { return std::tolower(c); });
    return text;
}

static Book* findBook(int id) {
    for (Book& book : catalogue) {
        if (book.id == id) {
            return &book;
        }
    }
    return nullptr;
}

static void addBook(const std::string& title, const std::string& author) {
    catalogue.push_back(Book{nextId++, title, author, false});
    std::cout << "Added #" << catalogue.back().id << "  " << title << "\n";
}

static void listBooks() {
    if (catalogue.empty()) {
        std::cout << "(the catalogue is empty)\n";
        return;
    }
    for (const Book& book : catalogue) {
        std::cout << std::setw(3) << book.id << "  "
                  << (book.borrowed ? "[out]" : "[in] ") << "  "
                  << book.title << "  -  " << book.author << "\n";
    }
}

static void search(const std::string& term) {
    const std::string needle = lower(term);
    int found = 0;
    for (const Book& book : catalogue) {
        if (lower(book.title).find(needle) != std::string::npos) {
            std::cout << "#" << book.id << "  " << book.title
                      << "  (" << (book.borrowed ? "borrowed" : "available") << ")\n";
            ++found;
        }
    }
    if (found == 0) {
        std::cout << "No books match \"" << term << "\".\n";
    }
}

static void setBorrowed(int id, bool borrowed) {
    Book* book = findBook(id);
    if (book == nullptr) {
        std::cout << "No book with id " << id << ".\n";
        return;
    }
    book->borrowed = borrowed;
    std::cout << (borrowed ? "Borrowed: " : "Returned: ") << book->title << "\n";
}

static void save() {
    std::ofstream out("library.txt");
    for (const Book& book : catalogue) {
        out << book.id << '|' << book.title << '|' << book.author
            << '|' << (book.borrowed ? 1 : 0) << '\n';
    }
    std::cout << "Saved " << catalogue.size() << " book(s) to library.txt\n";
}

static void load() {
    std::ifstream in("library.txt");
    std::string line;
    while (std::getline(in, line)) {
        std::istringstream row(line);
        std::string id, title, author, borrowed;
        std::getline(row, id, '|');
        std::getline(row, title, '|');
        std::getline(row, author, '|');
        std::getline(row, borrowed, '|');
        if (id.empty()) {
            continue;
        }
        Book book;
        book.id = std::stoi(id);
        book.title = title;
        book.author = author;
        book.borrowed = (borrowed == "1");
        catalogue.push_back(book);
        nextId = std::max(nextId, book.id + 1);
    }
}

int main() {
    load();
    std::cout << "Library ready - " << catalogue.size() << " book(s) loaded.\n"
              << "Commands: add, list, search, borrow, return, save, quit\n";

    std::string command;
    while (std::cout << "> " && std::cin >> command) {
        if (command == "quit") {
            break;
        } else if (command == "add") {
            std::string title, author;
            std::cout << "title: ";
            std::cin.ignore();
            std::getline(std::cin, title);
            std::cout << "author: ";
            std::getline(std::cin, author);
            addBook(title, author);
        } else if (command == "list") {
            listBooks();
        } else if (command == "search") {
            std::string term;
            std::cout << "term: ";
            std::cin >> term;
            search(term);
        } else if (command == "borrow" || command == "return") {
            int id = 0;
            std::cout << "id: ";
            std::cin >> id;
            setBorrowed(id, command == "borrow");
        } else if (command == "save") {
            save();
        } else {
            std::cout << "Unknown command. Try: add, list, search, borrow, return, save, quit\n";
        }
    }

    save();
    return 0;
}
