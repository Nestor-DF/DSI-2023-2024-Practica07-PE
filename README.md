# Práctica 6 - Clases e interfaces genéricas. Principios SOLID
- Autor: Néstor Delgado Feliciano
- Correo: alu0101488998@ull.edu.es


[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct06-generics-solid-Nestor-DF/badge.svg)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct06-generics-solid-Nestor-DF)


## **Índice**
- [Práctica 6 - Clases e interfaces genéricas. Principios SOLID](#práctica-6---clases-e-interfaces-genéricas-principios-solid)
  - [**Índice**](#índice)
  - [**Introducción**](#introducción)
  - [**Ejercicio 1 - La mudanza**](#ejercicio-1---la-mudanza)
  - [**Ejercicio 2 - Facturas en diferentes formatos**](#ejercicio-2---facturas-en-diferentes-formatos)
  - [**Ejercicio 3 - Gestor de ficheros**](#ejercicio-3---gestor-de-ficheros)
  - [**Ejercicio 4 - Impresoras y escáneres**](#ejercicio-4---impresoras-y-escáneres)
  - [**Ejercicio 5 - Servicio de mensajería**](#ejercicio-5---servicio-de-mensajería)
  - [**Ejercicio PE**](#ejercicio-pe)
  - [**Conclusiones**](#conclusiones)
  - [**Recursos Empleados**](#recursos-empleados)




## **Introducción**
En esta práctica resolveré una serie de ejercicios de programación que me permitirán conocer más en profundidad las clases e interfaces genéricas y los principios SOLID.




## **Ejercicio 1 - La mudanza**
Ya que lo que necesitamos es guardar diferentes tipos de enseres, aunque estos comparten algo en común, lo primero que hice fue crear una interfaz como abstracción del tipo enser:
```ts
export interface Item {
  name: string;
  weight?: number;
  fragile?: boolean;
  value?: number;
}
```

A continuación, creé un par de ejemplos de tipo enser para poder testear, es decir, clases que implementan la interfaz definida:
```ts
export class Furniture implements Item {
  name: string;
  weight?: number;
  fragile?: boolean;
  value?: number;
  description: string;

  constructor(name: string, description: string, weight?: number, fragile?: boolean, value?: number) {
    this.name = name;
    this.description = description;
    this.weight = weight;
    this.fragile = fragile;
    this.value = value;
  }
}

export class Appliance implements Item {
  name: string;
  weight?: number;
  fragile?: boolean;
  value?: number;
  type: string;

  constructor(name: string, type: string, weight?: number, fragile?: boolean, value?: number) {
    this.name = name;
    this.type = type;
    this.weight = weight;
    this.fragile = fragile;
    this.value = value;
  }
}
```

El siguiente paso es crear la propia clase Caja la cual tendrá un **parámetro de tipo en su definición** restringiendo la forma de los objetos que podrá contender dicha Caja a diferentes tipos de enseres:
```ts
export class Box<T extends Item> {
  private items: T[] = [];
  public id: number;

  constructor(id: number) {
    this.id = id;
  }

  addItem(item: T): void {
    this.items.push(item);
  }

  removeItem(name: string): void {
    this.items = this.items.filter((item) => item.name !== name);
  }

  findItems(filters: { name?: string; weight?: number; fragile?: boolean; value?: number }): string {
    const result = this.items.filter(
      (element) =>
        (!filters.name || element.name.includes(filters.name)) &&
        (!filters.weight || element.weight === filters.weight) &&
        (filters.fragile === undefined || element.fragile === filters.fragile) &&
        (!filters.value || element.value === filters.value)
    );
    return result.map((item) => item.name).join(", ");
  }

  listItems(): string {
    const result = `${this.id}: ${this.items.map((item) => item.name).join(", ")}`;
    return result;
  }
}
```

Finalmente, creé una clase adicional para poder gestionar las cajas de la mudanza con algunos métodos sencillos:
```ts
export class MovingManager<T extends Item> {
  private boxes: Box<T>[] = [];

  addBox(box: Box<T>): void {
    this.boxes.push(box);
  }

  removeBox(id: number): void {
    this.boxes = this.boxes.filter((box) => box.id !== id);
  }

  getBoxesCount(): number {
    return this.boxes.length;
  }

  BoxesString(): string {
    return this.boxes.map((box) => box.listItems()).join("\n");
  }
}
```




## **Ejercicio 2 - Facturas en diferentes formatos**
En este ejercicio se trata principalmente el **segundo principio de SOLID (Open-closed principle)**, ya que el sistema diseñado deberá permitir añadir nuevos formatos de generación de facturas **sin necesidad de modificar** el código ya implementado. Para conseguir esto, lo primero que hice fue crear una abstracción del problema principal, exportar facturas, para ello creé la siguiente interfaz:
```ts
export interface BillExporter {
  exportBill(factura: Bill): string;
}
```
Que recibe una factura (la definiré más adelante) y devolverá una cadena que será el text en el "nuevo formato".

La clase `Bill` es la siguiente:
```ts
export class Bill {
  public id: string;
  public amount: number;
  public dueDate: string;
  public isPaid: boolean;

  constructor(id: string, amount: number, dueDate: string) {
    this.id = id;
    this.amount = amount;
    this.dueDate = dueDate;
    this.isPaid = false;
  }

  markAsPaid(): void {
    this.isPaid = true;
  }

  getDetails(): string {
    const status: string = this.isPaid ? "Paid" : "Unpaid";
    return `ID: ${this.id}\nAmount: $${this.amount}\nDue Date: ${this.dueDate}\nStatus: ${status}`;
  }
}
```

Una clase que almacena información como el id de la factura, la cantidad a pagar, fecha máxima para pagar y si ya está pagada o no. Y métodos como marcar que esté pagada y obtener la información de la factura.

A continuación, creé las dos clases que se encargarán de implementar la lógica para exportar la factura en diferentes formatos (una por formato). Estas clases implementarán la interfaz `Billexporter` que definimos antes.
```ts
export class PDFexporter implements BillExporter {
  exportBill(factura: Bill): string {
    return `Exporting the bill ${factura.id} to PDF`;
  }
}

export class HTMLexporter implements BillExporter {
  exportBill(factura: Bill): string {
    return `Exporting the bill ${factura.id} to HTML`;
  }
}
```

Por último, implementé la clase principal que se encargará de exportar las facturas haciendo uso de las clases que implementan la interfaz `Billexporter`, de esta manera, si se quisiera añadir un nuevo formato para exportar las facturas solo se tendría que crear una clase nueva que implementara la interfaz, **respetando así el Open-closed principle.**
```ts
export class BillManager<T extends Billexporter> {
  constructor(private exporter: T) {}

  exportBill(bill: Bill): string {
    return this.exporter.exportBill(bill);
  }

  setExporter(exporter: T): void {
    this.exporter = exporter;
  }
}
```




## **Ejercicio 3 - Gestor de ficheros**
El principio que no se está siguiendo es el principio SOLID de Responsabilidad Única (Single Responsibility Principle) ya que `FileManager` tiene dos responsabilidades distintas: la lectura de archivos y la escritura de archivos.

Una mejor forma de estructurar este código según SOLID sería crear dos interfaces `IFileReade` e `IFileWriter` para encapsular las responsabilidades de lectura y escritura de archivos y dos clases `FileReader` y `FileWriter` que implementan estas interfaces. Por último, la clase `FileManager` se encargaría únicamente de gestionar esas operaciones y no de su implementación.

```ts
export interface IFileReader {
  readFile(filePath: string): string;
}

export interface IFileWriter {
  writeFile(filePath: string, data: string): void;
}

export class FileReader implements IFileReader {
  public readFile(filePath: string): string {
    try {
      const content: string = fs.readFileSync(filePath, "utf-8");
      return content;
    } catch (error) {
      console.error("Error al escribir en el archivo:", (error as Error).message);
      return "";
    }
  }
}

export class FileWriter implements IFileWriter {
  public writeFile(filePath: string, data: string): void {
    try {
      fs.writeFileSync(filePath, data, "utf-8");
      console.log("Archivo escrito exitosamente.");
    } catch (error) {
      console.error("Error al escribir en el archivo:", (error as Error).message);
    }
  }
}

export class FileManager {
  private fileReader: IFileReader;
  private fileWriter: IFileWriter;
  private filePath: string;

  constructor(filePath: string, fileReader: IFileReader, fileWriter: IFileWriter) {
    this.filePath = filePath;
    this.fileReader = fileReader;
    this.fileWriter = fileWriter;
  }

  public setFilePath(filePath: string): void {
    this.filePath = filePath;
  }

  public readFile(): string {
    return this.fileReader.readFile(this.filePath);
  }

  public writeFile(data: string): void {
    this.fileWriter.writeFile(this.filePath, data);
  }
}
```




## **Ejercicio 4 - Impresoras y escáneres**
El principio que no se esta siguiendo es el de segregación de interfaces (Interface Segregation Principle) de SOLID. Básicamente, sugiere que es mejor tener un número elevado de interfaces simples y específicas que tener una interfaz compleja y genérica y que una clase no debe verse obligada a implementar interfaces que no utiliza. En este caso, la clase `Printer` implementa la interfaz `PrintableScannable` pero no utiliza el método `scan()`, y la clase `Scanner` implementa la misma interfaz pero no utiliza el método `print()`.

Una mejor implementación sería dividir la interfaz `PrintableScannable` en dos interfaces separadas, una para la impresión y otra para el escaneo y así conseguir que no se implementen métodos vacíos:

```ts
export interface Printable {
  print(): void;
}

export interface Scannable {
  scan(): void;
}

export class Printer implements Printable {
  print(): void {
    console.log('Printing...');
  }
}

export class Scanner implements Scannable {
  scan(): void {
    console.log('Scanning...');
  }
}

export class PrinterScanner implements Printable, Scannable {
  print(): void {
    console.log('Printing...');
  }

  scan(): void {
    console.log('Scanning...');
  }
}
```




## **Ejercicio 5 - Servicio de mensajería**
El principio que se está violando es el de inversión de dependencia (Dependency Inversion Principle) de SOLID. Este principio sugiere que las clases deberían depender de la abstracción y no de la particularización. Lo que viene a significar es que el código de alto nivel que desarrollamos no debería depender de implementaciones concretas de clases, sino de aquellas abstracciones, ya sean clases o interfaces, que luego, se particularicen en implementaciones de las mismas. 

En el ejercicio la clase `Notifier` depende directamente de las implementaciones concretas `EmailService` y `ShortMessageService`, en lugar de depender de abstracciones. Una mejor implementación sería introducir una interfaz o clase abstracta que represente la abstracción de los servicios de notificación, y luego hacer que `EmailService` y `ShortMessageService` implementen esa abstracción. La clase `Notifier` debería depender de esa abstracción en lugar de las implementaciones concretas:

```ts
export interface NotificationService {
  notify(message: string): void;
}

export class EmailService implements NotificationService {
  notify(message: string): void {
    console.log(`Sending notification by email: ${message}`);
  }
}

export class ShortMessageService implements NotificationService {
  notify(message: string): void {
    console.log(`Sending notification by SMS: ${message}`);
  }
}

xeport class Notifier {
  constructor(private notificationService: NotificationService) {
  }

  sendNotification(message: string): void {
    this.notificationService.notify(message);
  }
}
```




## **Ejercicio PE**
En primer lugar, creé las interfaces genéricas `Collectable` y `Searchable` con los métodos que se pedían en el enunciado:
```ts
export interface Collectable<T> {
  addItem(item: T): void;
  getItem(index: number): T | undefined;
  removeItem(): void;
  getNumberOfItems(): number;
}

export interface Searchable<T> {
  search(item: T): T[];
}
```

A continuación, implementé dichas interfaces en una **clase abstracta** `SearchableCollection` ya que dejo como **abstracto** el método **search** para que lo puedan implementar las subclases correspondientes. Los métodos de `Collectable` son todos implementados en la clase abstracta:
```ts
export abstract class SearchableCollection<T> implements Collectable<T>, Searchable<T> {
  constructor(protected items: T[]) {}

  addItem(item: T): void {
    this.items.push(item);
  }

  getItem(index: number): T | undefined {
    return this.items[index];
  }

  removeItem(): void {
    this.items.pop();
  }

  getNumberOfItems(): number {
    return this.items.length;
  }

  getCollectionString(): string {
    return this.items.toString();
  }

  abstract search(item: T): T[];
}
```

Por último, creé las **subclases** que **heredarán** de la **clase abstracta** para implementar el método search. Una restringe el tipo genérico a **number** y la otra a **string**:
```ts
export class NumericSearchableCollection extends SearchableCollection<number> {
  search(item: number): number[] {
    return this.items.filter((num) => num === item);
  }
}

export class StringSearchableCollection extends SearchableCollection<string> {
  search(substring: string): string[] {
    const regex = new RegExp(substring, "d");
    return this.items.filter((item) => regex.test(item));
  }
}
```
En `NumericSearchableCollection` se buscan las ocurrencias de un número dado mientras que en `StringSearchableCollection` se buscan las cadenas que contengan una subcadena dada.




## **Conclusiones**
En conclusión, la resolución de los ejercicios de programación me han ayudado a conocer más en profundidad las clases e interfaces genéricas y los principios SOLID.




## **Recursos Empleados**

1. OpenAI Chat: [https://chat.openai.com/](https://chat.openai.com/)

2. W3Schools JavaScript Reference: [https://www.w3schools.com/jsrEF/default.asp](https://www.w3schools.com/jsrEF/default.asp)

3. MDN Web Docs - JavaScript Reference: [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)