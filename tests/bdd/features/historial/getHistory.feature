Feature: Obtener historial de registros

  Scenario: Parámetros válidos
    Given un tamaño de página "2" y un número de página "1"
    When llamo al método "getHistory"
    Then debe retornar los registros obtenidos del repositorio
    And el repositorio debe ser llamado con tamaño de página "2" y número de página "1"

  Scenario: Parámetro "pageSize" fuera del rango
    Given un tamaño de página "0" y un número de página "1"
    When llamo al método "getHistory"
    Then debe lanzar un error con el mensaje "El parámetro 'pageSize' debe estar entre 1 y 10."

  Scenario: Parámetro "pageSize" mayor al máximo permitido
    Given un tamaño de página "11" y un número de página "1"
    When llamo al método "getHistory"
    Then debe lanzar un error con el mensaje "El parámetro 'pageSize' debe estar entre 1 y 10."
