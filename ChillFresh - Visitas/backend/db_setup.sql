-- Script para crear las tablas de la base de datos ChillFresh
-- Ejecutar este script en SQL Server Management Studio

-- Crear la base de datos si no existe
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'ChillFresh')
BEGIN
    CREATE DATABASE ChillFresh;
END
GO

USE ChillFresh;
GO

-- Tabla de Usuarios
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Usuarios')
BEGIN
    CREATE TABLE Usuarios (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre NVARCHAR(100) NOT NULL,
        email NVARCHAR(100) NOT NULL UNIQUE,
        password NVARCHAR(100) NOT NULL,
        rol NVARCHAR(20) NOT NULL DEFAULT 'usuario',
        fechaCreacion DATETIME DEFAULT GETDATE()
    );
END
GO

-- Tabla de Clientes
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Clientes')
BEGIN
    CREATE TABLE Clientes (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre NVARCHAR(200) NOT NULL,
        direccion NVARCHAR(300),
        telefono NVARCHAR(20),
        email NVARCHAR(100),
        rut NVARCHAR(20) NOT NULL UNIQUE,
        activo BIT DEFAULT 1,
        fechaCreacion DATETIME DEFAULT GETDATE()
    );
END
GO

-- Tabla de Visitas
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Visitas')
BEGIN
    CREATE TABLE Visitas (
        id INT IDENTITY(1,1) PRIMARY KEY,
        clienteId INT NOT NULL,
        fecha DATETIME NOT NULL,
        motivo NVARCHAR(500) NOT NULL,
        observaciones NVARCHAR(MAX),
        estado NVARCHAR(20) DEFAULT 'pendiente',
        creadorId INT,
        fechaCreacion DATETIME DEFAULT GETDATE(),
        CONSTRAINT FK_Visitas_Clientes FOREIGN KEY (clienteId) REFERENCES Clientes(id),
        CONSTRAINT FK_Visitas_Usuarios FOREIGN KEY (creadorId) REFERENCES Usuarios(id)
    );
END
GO

-- Insertar datos de prueba para Usuarios
IF NOT EXISTS (SELECT * FROM Usuarios WHERE email = 'admin@chillfresh.cl')
BEGIN
    INSERT INTO Usuarios (nombre, email, password, rol)
    VALUES ('Administrador', 'admin@chillfresh.cl', 'admin123', 'administrador');
END
GO

IF NOT EXISTS (SELECT * FROM Usuarios WHERE email = 'tecnico@chillfresh.cl')
BEGIN
    INSERT INTO Usuarios (nombre, email, password, rol)
    VALUES ('Técnico', 'tecnico@chillfresh.cl', 'tecnico123', 'tecnico');
END
GO

-- Insertar datos de prueba para Clientes
IF NOT EXISTS (SELECT * FROM Clientes WHERE rut = '76.123.456-7')
BEGIN
    INSERT INTO Clientes (nombre, direccion, telefono, email, rut)
    VALUES ('Supermercado El Líder', 'Av. Principal 123, Santiago', '+56 2 2345 6789', 'contacto@lider.cl', '76.123.456-7');
END
GO

IF NOT EXISTS (SELECT * FROM Clientes WHERE rut = '77.987.654-3')
BEGIN
    INSERT INTO Clientes (nombre, direccion, telefono, email, rut)
    VALUES ('Restaurant Costa Azul', 'Costanera Sur 456, Viña del Mar', '+56 32 234 5678', 'reservas@costaazul.cl', '77.987.654-3');
END
GO

IF NOT EXISTS (SELECT * FROM Clientes WHERE rut = '78.456.789-1')
BEGIN
    INSERT INTO Clientes (nombre, direccion, telefono, email, rut)
    VALUES ('Hotel Pacífico', 'Playa Grande 789, La Serena', '+56 51 987 6543', 'reservas@hotelpacifico.cl', '78.456.789-1');
END
GO

-- Insertar datos de prueba para Visitas
DECLARE @Cliente1Id INT, @Cliente2Id INT, @AdminId INT

SELECT @Cliente1Id = id FROM Clientes WHERE rut = '76.123.456-7'
SELECT @Cliente2Id = id FROM Clientes WHERE rut = '77.987.654-3'
SELECT @AdminId = id FROM Usuarios WHERE email = 'admin@chillfresh.cl'

IF NOT EXISTS (SELECT * FROM Visitas WHERE clienteId = @Cliente1Id AND CONVERT(DATE, fecha) = CONVERT(DATE, GETDATE()-30))
BEGIN
    INSERT INTO Visitas (clienteId, fecha, motivo, observaciones, estado, creadorId)
    VALUES (@Cliente1Id, DATEADD(DAY, -30, GETDATE()), 'Mantenimiento preventivo', 'Se realizó limpieza de filtros y revisión general del sistema de refrigeración', 'completada', @AdminId);
END
GO

IF NOT EXISTS (SELECT * FROM Visitas WHERE clienteId = @Cliente2Id AND CONVERT(DATE, fecha) = CONVERT(DATE, GETDATE()-10))
BEGIN
    DECLARE @Cliente2Id INT, @AdminId INT
    SELECT @Cliente2Id = id FROM Clientes WHERE rut = '77.987.654-3'
    SELECT @AdminId = id FROM Usuarios WHERE email = 'admin@chillfresh.cl'
    
    INSERT INTO Visitas (clienteId, fecha, motivo, observaciones, estado, creadorId)
    VALUES (@Cliente2Id, DATEADD(DAY, -10, GETDATE()), 'Reparación de compresor', 'Se reemplazó el compresor de la unidad principal', 'completada', @AdminId);
END
GO

IF NOT EXISTS (SELECT * FROM Visitas WHERE clienteId = @Cliente1Id AND CONVERT(DATE, fecha) = CONVERT(DATE, DATEADD(DAY, 5, GETDATE())))
BEGIN
    DECLARE @Cliente1Id INT, @AdminId INT
    SELECT @Cliente1Id = id FROM Clientes WHERE rut = '76.123.456-7'
    SELECT @AdminId = id FROM Usuarios WHERE email = 'admin@chillfresh.cl'
    
    INSERT INTO Visitas (clienteId, fecha, motivo, observaciones, estado, creadorId)
    VALUES (@Cliente1Id, DATEADD(DAY, 5, GETDATE()), 'Mantenimiento trimestral', 'Revisión programada de sistemas de refrigeración', 'pendiente', @AdminId);
END
GO
