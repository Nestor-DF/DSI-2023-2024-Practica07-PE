// usuario / acción sobre el sistema / fecha-hora en la que tuvo lugar la acción.
type loginInfo = [string, string, Date];

/**
 * Clase Logger para manejar registro de actividad
 */
export class Logger implements Iterable<loginInfo> {
  private static instanceLogger: Logger;
  private log: Array<loginInfo> = [];

  private constructor() {}

  /**
   * Método para devolver la única instacia de la clase, si no existe la crea
   * @returns La instancia sinleton
   */
  public static getInstance(): Logger {
    if (!Logger.instanceLogger) {
      Logger.instanceLogger = new Logger();
    }
    return Logger.instanceLogger;
  }

  /**
   * Método para añadir un log
   * @param user Usuario
   * @param action Acción
   * @param date Fecha
   */
  addLog(user: string, action: string, date: Date): void {
    this.log.push([user, action, date]);
  }

  /**
   * Obtener logs
   * @returns Los logs
   */
  getLogs(): Array<loginInfo> {
    return this.log;
  }

  /**
   * Obtener logs de un usuario en concreto
   * @param user El usuario
   * @returns Los logs de ese usuario
   */
  getLogByUser(user: string): Array<loginInfo> {
    return this.log.filter((entry) => entry[0] === user);
  }

  /**
   * Obtener logs cuya acción sea login
   * @returns Los logs correspondientes a la acción
   */
  getLogsByAction(action: string): Array<loginInfo> {
    return this.log.filter((entry) => entry[1] === action);
  }

  /**
   * Obtener logs dentro de una fecha
   * @param startDate
   * @param endDate
   * @returns Los logs entre las dos fechas
   */
  getLogsBetweenDates(startDate: Date, endDate: Date): Array<loginInfo> {
    return this.log.filter((entry) => entry[2] >= startDate && entry[2] <= endDate);
  }

  /**
   * Para que sea iterable
   * @returns
   */
  [Symbol.iterator](): Iterator<loginInfo> {
    return this.log.values();
  }
}
