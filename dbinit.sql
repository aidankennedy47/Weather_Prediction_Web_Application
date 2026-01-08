-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: localhost    Database: ForecastFortune
-- ------------------------------------------------------
-- Server version	8.0.32-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `ForecastFortune`
--

/*!40000 DROP DATABASE IF EXISTS `ForecastFortune`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `ForecastFortune` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `ForecastFortune`;

--
-- Table structure for table `History`
--

DROP TABLE IF EXISTS `History`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `History` (
  `historyID` int NOT NULL AUTO_INCREMENT,
  `userID` int DEFAULT NULL,
  `predID` int DEFAULT NULL,
  `weatherID` int DEFAULT NULL,
  `pointsAwarded` int DEFAULT NULL,
  PRIMARY KEY (`historyID`),
  KEY `userID` (`userID`),
  KEY `predID` (`predID`),
  KEY `weatherID` (`weatherID`),
  CONSTRAINT `History_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `User` (`userID`),
  CONSTRAINT `History_ibfk_2` FOREIGN KEY (`predID`) REFERENCES `Prediction` (`predID`),
  CONSTRAINT `History_ibfk_3` FOREIGN KEY (`weatherID`) REFERENCES `Weather` (`weatherID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `History`
--

LOCK TABLES `History` WRITE;
/*!40000 ALTER TABLE `History` DISABLE KEYS */;
INSERT INTO `History` VALUES (1,1,1,1,8),(2,2,2,2,10),(3,3,3,3,10),(4,4,4,4,9),(5,5,5,5,10),(6,6,6,6,10),(7,7,7,7,8),(8,8,8,8,9);
/*!40000 ALTER TABLE `History` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Prediction`
--

DROP TABLE IF EXISTS `Prediction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Prediction` (
  `predID` int NOT NULL AUTO_INCREMENT,
  `userID` int DEFAULT NULL,
  -- `weatherID` int DEFAULT NULL,
  `location` varchar(80) NOT NULL,
  `date` date NOT NULL,
  `predictedDate` date NOT NULL,
  `predictedMaxTemp` float DEFAULT NULL,
  `predictedMinTemp` float DEFAULT NULL,
  `predictedRainfall` int DEFAULT NULL,
  `predictedWindspeed` int DEFAULT NULL,
  `pointsBetted` int DEFAULT NULL,
  PRIMARY KEY (`predID`),
  KEY `userID` (`userID`),
  CONSTRAINT `Prediction_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `User` (`userID`)
  -- KEY `weatherID` (`weatherID`),
  -- CONSTRAINT `Prediction_ibfk_2` FOREIGN KEY (`weatherID`) REFERENCES `Weather` (`weatherID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Prediction`
--

LOCK TABLES `Prediction` WRITE;
/*!40000 ALTER TABLE `Prediction` DISABLE KEYS */;
INSERT INTO `Prediction` VALUES (1,1,'New York','2025-05-20','2025-05-23',25,15,10,12,20),(2,2,'Toronto','2025-05-20','2025-05-23',22.5,14.5,5,10,15),(3,3,'Sydney','2025-05-21','2025-05-24',18,9,20,8,25),(4,4,'London','2025-05-21','2025-05-25',19.5,11,12,14,30),(5,5,'Guadalajara','2025-05-22','2025-05-26',30,20,0,5,10),(6,6,'Mumbai','2025-05-22','2025-05-27',35,27,50,6,50),(7,7,'Cape Town','2025-05-23','2025-05-28',20,12,15,10,20),(8,8,'Berlin','2025-05-23','2025-05-28',23,13,8,9,25);
/*!40000 ALTER TABLE `Prediction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(20) NOT NULL,
  `lastName` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `username` varchar(80) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_picture_URL` varchar(255) DEFAULT NULL,
  `country` varchar(80) NOT NULL,
  `location` varchar(80) NOT NULL,
  `points` int NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
-- NOTE: Passwords are hashed, but for testing purposes the passwords are 'password1', 'password2', ect. corresponding with the dummy data id value
INSERT INTO `User` VALUES (1,'Alice','Smith','alice.smith@example.com','alice123','$2b$12$zpvTjffOcA5aONp0r40mN.G4XffuhM3YsJPnxav9IjiWSgeq6WAkC','https://example.com/profiles/alice.jpg','USA','New York',150),(2,'Bob','Johnson','bob.johnson@example.com','bobbyJ','$2b$12$H2vWp9wXwjAz.ccU3x666Ov9PBYP9hA.PwyRSjKTdn.S.M0VeCFai','https://example.com/profiles/bob.jpg','Canada','Toronto',120),(3,'Charlie','Nguyen','charlie.nguyen@example.com','charlieN','$2b$12$/K0Bon9otH6OuKnzuZazpOjrxBvnoH8F2k04orzrlaW2vvs2HlaHy',NULL,'Australia','Sydney',200),(4,'Diana','Lee','diana.lee@example.com','dlee','$2b$12$HMuSqfUlVrPl38.QPtI4oeFmlXaMAe1Ps539UM3l6sYEmnYHVzNcy','https://example.com/profiles/diana.jpg','UK','London',180),(5,'Ethan','Garcia','ethan.garcia@example.com','egarcia','$2b$12$FOV.o/d16g7oVyW.YT.lguA.qpFOq8EIA50Kg1YKik/9zqIZE9n9C',NULL,'Mexico','Guadalajara',90),(6,'Fatima','Khan','fatima.khan@example.com','fatimak','$2b$12$RBfzhwajxW9H7BKHcqNXH.wkaHPxfL83/eOsMfwyZ4wHXTadw1/2C','https://example.com/profiles/fatima.jpg','India','Mumbai',210),(7,'George','Brown','george.brown@example.com','geo_b','$2b$12$uQXKvVCTe0Uui5mfApF5tO2k1kGRzC37JeH8p26ICGqxoO9GS009W',NULL,'South Africa','Cape Town',75),(8,'Hannah','Müller','hannah.muller@example.com','hmuller','$2b$12$HR810iJXkDRHQS4Lf01shuGi923RkINyML51Gr.nAiwnpYglpaMUG','https://example.com/profiles/hannah.jpg','Germany','Berlin',160);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Weather`
--

DROP TABLE IF EXISTS `Weather`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Weather` (
  `weatherID` int NOT NULL AUTO_INCREMENT,
  `location` varchar(80) NOT NULL,
  `lastUpdated` date NOT NULL,
  `maxTemp` float DEFAULT NULL,
  `minTemp` float DEFAULT NULL,
  `rainfall` float DEFAULT NULL,
  `maxWindspeed` float DEFAULT NULL,
  PRIMARY KEY (`weatherID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Weather`
--

LOCK TABLES `Weather` WRITE;
/*!40000 ALTER TABLE `Weather` DISABLE KEYS */;
-- INSERT INTO `Weather` VALUES (1,1,'2025-05-23',24.5,26,15.5,1,12,11,14),(2,2,'2025-05-23',21,22,14,0,2,9,12),(3,3,'2025-05-24',17.5,18,9.5,1,18,7,10),(4,4,'2025-05-25',19,20,10.5,1,10,13,16),(5,5,'2025-05-26',29,30,19.5,0,0,6,7),(6,6,'2025-05-27',34,35,27.5,1,52,5,8),(7,7,'2025-05-28',19.5,21,12.5,1,13,9,11),(8,8,'2025-05-28',22.5,23.5,13.5,0,6,8,10);
/*!40000 ALTER TABLE `Weather` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'ForecastFortune'
--

CREATE USER 'user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON ForecastFortune.* TO 'user'@'localhost';
FLUSH PRIVILEGES;

--
-- Dumping routines for database 'ForecastFortune'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-22  4:59:13
