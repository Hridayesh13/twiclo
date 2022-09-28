-- MySQL dump 10.19  Distrib 10.3.34-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: twiclone
-- ------------------------------------------------------
-- Server version	10.3.34-MariaDB-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `text` varchar(140) NOT NULL,
  `author_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`comment_id`),
  KEY `author_id` (`author_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (10,'welcome user 5',2,13,'2022-09-08 00:28:57'),(11,'wlcm :P',5,13,'2022-09-08 00:29:43'),(12,'testing comments',2,19,'2022-09-08 14:48:14'),(13,'new comment\r\n',2,19,'2022-09-08 16:34:24'),(14,'first comment on server',10,20,'2022-09-21 19:10:08'),(15,'now it works suddenly \'-\'',11,20,'2022-09-24 11:06:48');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posts` (
  `post_id` int(11) NOT NULL AUTO_INCREMENT,
  `text` varchar(280) NOT NULL,
  `author_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `possibly_sensitive` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`post_id`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,'heehehehehehehhehe :) <3',2,'2022-08-24 22:23:03',0),(2,'second post ^o^',2,'2022-08-24 22:28:00',0),(3,'third post',2,'2022-08-25 16:41:02',0),(4,'user 3 posts something\r\nhahaha (:',5,'2022-08-31 18:51:01',0),(5,'another one',5,'2022-08-31 18:51:54',0),(6,'something something something something something something something something something something something ',5,'2022-08-31 19:56:37',0),(7,'something again something again something again something again something again something again something again ',5,'2022-08-31 19:56:58',0),(12,'first post was deleted ):',6,'2022-08-31 23:40:45',0),(13,'user 5 is here',7,'2022-09-01 16:35:34',0),(15,'i will be deleted soon',9,'2022-09-06 17:21:52',0),(19,'example post',2,'2022-09-08 14:47:58',0),(20,'first post on server',10,'2022-09-21 18:23:50',0);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test','test','test@test.com'),(2,'Hridayesh','$2a$10$/r5itT5T9qNhY1KJGTa8wesoEIIlLN4m.8T0OPEWVXLCBhFfSTF5.','hri@gmail.com'),(3,'User 1','$2a$10$vwKx4tXaD4SdFKHe5MIpgOQOECA6Hj1Rhedk23maNaFP6KbsN1/3.','user1@test.com'),(4,'User 2','$2a$10$Z9vNLS9HdSPwhkb2HSM4buStXcOJUOO.pgtH09/ZcV767YZeo9xbm','user2@test.com'),(5,'User 3','$2a$10$ADQp.wm33yGhlpThwQDYW.FePKlzHOGIiKZ0hqCxmakYKZePXHfnO','user3@gmail.com'),(6,'User 4','$2a$10$Iabi5G3eoZMEZ6p4WqgQeOPfhT0iCXRrdNuAfDrPnnu5Q0KRb/2oy','user4@gmail.com'),(7,'User 5','$2a$10$SmzcczTmfkVOlifJWLWjxulRXrPfrtzhz1GMCvfuVvBaXLKwY9Yxe','user5@gamil.com'),(8,'deleted_user','$2a$10$z1Wh6PdYWIHK7bR5mXlzj.QxDpgCs1qLSmjeC0s9zD0UMXEPKGEq.','deleted_credentials'),(9,'deleted_user','$2a$10$GfgzVwKmldsqBF76nJltp.YMX93oB8mE75HKmktCq7SzzJ0WSBBsK','deleted_credentials'),(10,'qwerty','$2a$10$SA9ovhZHVvg9biurx7OxpunqfsRTUt1d.LRSzqdvsqtsk.ZAva/Ti','qwerty@gmail.com'),(11,'rndm user','$2a$10$br8yz.9sUwaE8bKYtHkBYe2iBw7PpntKG.WX43YXwxB3M373PALva','rndm0@gmail.com');
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

-- Dump completed on 2022-09-28 18:00:09
