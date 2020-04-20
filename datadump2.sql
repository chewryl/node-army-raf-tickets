-- MySQL dump 10.13  Distrib 8.0.19, for macos10.15 (x86_64)
--
-- Host: localhost    Database: avr-tickets
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `addresses` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `address1` varchar(45) NOT NULL,
  `address2` varchar(45) NOT NULL,
  `townCity` varchar(45) NOT NULL,
  `county` varchar(45) NOT NULL,
  `postalCode` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (9,'65 Mallard Avenue','Chippenham','Swindon','Berkshire','SN15 4QF'),(10,'65 Mallard Avenue','Chippenham','Swindon','Berkshire','SN15 4QF'),(11,'65 Mallard Avenue','Chippenham','Swindon','Berkshire','SN15 4QF'),(12,'65 Mallard Avenue','Chippenham','Swindon','Berkshire','SN15 4QF'),(13,'65 Mallard Avenue','Chippenham','Swindon','Berkshire','SN15 4QF'),(14,'65 Mallard Avenue','Chippenham','Swindon','Berkshire','SN15 4QF'),(15,'65 Mallard Avenue','Chippenham','Swindon','Berkshire','SN15 4QF'),(16,'65 Mallard Avenue','Chippenham','Swindon','Berkshire','SN15 4QF'),(17,'65 Mallard Avenue','Chippenham','Swindon','Berkshire','SN15 4QF'),(18,'65 Mallard Avenue','Chippenham','Swindon','Berkshire','SN15 4QF'),(19,'22 Linton Avenue','Quedgeley','Gloucester','Gloucestershire','GL2 2DR'),(20,'65 Mallard Avenue','Chippenham','Swindon','Berkshire','SN15 4QF');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderItems`
--

DROP TABLE IF EXISTS `orderItems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `orderItems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quantity` int DEFAULT NULL,
  `orderId` int DEFAULT NULL,
  `ticketId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orderItems_ticketId_orderId_unique` (`orderId`,`ticketId`),
  KEY `ticketId` (`ticketId`),
  CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_3` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderItems`
--

LOCK TABLES `orderItems` WRITE;
/*!40000 ALTER TABLE `orderItems` DISABLE KEYS */;
INSERT INTO `orderItems` VALUES (1,1,1,3),(2,2,1,2),(3,1,2,3),(4,2,2,2),(5,1,3,1),(6,1,4,1);
/*!40000 ALTER TABLE `orderItems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `addressId` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orders_ibfk_1_idx` (`userId`),
  KEY `orders_ibfk_2_idx` (`addressId`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`addressId`) REFERENCES `addresses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,7,17),(2,7,18),(3,7,19),(4,7,20);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8 COLLATE utf8_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('OgWVGWrNyCn0trEEp3aw9AGoIFNkAIop',1587425481,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"csrfSecret\":\"loTlhXmblF4XP4bJ8eupoW_6\",\"flash\":{},\"total\":\"40.00\",\"cart\":[{\"id\":1,\"tier\":\"Seating (Member)\",\"price\":15,\"qty\":2},{\"id\":2,\"tier\":\"Standing (Member)\",\"price\":10,\"qty\":1}],\"isLoggedIn\":true,\"user\":{\"id\":7,\"firstName\":\"Chex\",\"lastName\":\"Mex\",\"email\":\"chex_mex@gmail.com\",\"password\":\"$2a$12$PR8SaHw/68K8JA/fnjFDW.K6cWfsI06s3G5aaQ.Rrm92AFLcicQ6W\",\"resetToken\":null,\"resetTokenExpiration\":null},\"addressArr\":[\"22 Linton Avenue\",\"Quedgeley\",\"Gloucester\",\"Gloucestershire\",\"GL2 2DR\"]}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tier` varchar(255) NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (1,'Seating (Member)',15.00),(2,'Standing (Member)',10.00),(3,'Seating (Non-Member)',20.00),(4,'Standing (Non-Member)',15.00),(5,'Junior',1.00);
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `resetToken` varchar(255) DEFAULT NULL,
  `resetTokenExpiration` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Cheryl','Mataitini','cherylmataitini@gmail.com','$2a$12$.MwDZM1k8au5UC6udZdZZ.TS3VYx9L.34qJsBkaPIJjxTIPbXLj86',NULL,NULL),(2,'Chez','Mat','cheryl_mataitini@yahoo.com','$2a$12$jlhJuYsYST/FtXrL3ccdcueT/AnheR4UfAIuwIy6zlhhMh0.di.M6',NULL,NULL),(4,'Fred','Chopin','fredericChopin@gmail.com','$2a$12$r.EwfTlFvW8FHo0jewuNaueGx8mpN.P8S0.j7wdcp6LuqD28Mh12u',NULL,NULL),(5,'Chex','Mex','Bobita07@hotmail.com','$2a$12$wVMy3TdWUKopDtOKGisg3OqVI2HkGoWP1L2v3NhSj1X6GFQZU1AzK',NULL,NULL),(6,'Dax','Clorx','DaxClorx@gmail.com','$2a$12$sH1RlULHbW0wyCfKGwioTO0QhJ4Z8IGxM3mkyI8MuB.htR0ArUNgK',NULL,NULL),(7,'Chex','Mex','chex_mex@gmail.com','$2a$12$PR8SaHw/68K8JA/fnjFDW.K6cWfsI06s3G5aaQ.Rrm92AFLcicQ6W',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-04-20  4:31:55
