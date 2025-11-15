package com.multiuserbloggingplatform.backend.controller;

import com.multiuserbloggingplatform.backend.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/media")
@CrossOrigin(origins = "http://localhost:5177")
public class MediaController {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.base.url:http://localhost:8080}")
    private String baseUrl;

    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    );

    private static final List<String> ALLOWED_FILE_TYPES = Arrays.asList(
        "application/pdf", "application/msword", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain", "application/zip"
    );

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    // Upload image
    @PostMapping("/upload/image")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            // Validate file
            String validationError = validateImageFile(file);
            if (validationError != null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Image upload failed", validationError));
            }

            // Create upload directory if it doesn't exist
            createUploadDirectory();

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFilename);
            String uniqueFilename = generateUniqueFilename("image", fileExtension);

            // Save file
            Path filePath = Paths.get(uploadDir, "images", uniqueFilename);
            Files.createDirectories(filePath.getParent());
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Generate URL
            String fileUrl = baseUrl + "/api/v1/media/images/" + uniqueFilename;

            Map<String, String> response = new HashMap<>();
            response.put("filename", uniqueFilename);
            response.put("originalName", originalFilename);
            response.put("url", fileUrl);
            response.put("size", String.valueOf(file.getSize()));
            response.put("type", file.getContentType());

            return ResponseEntity.ok(ApiResponse.success(
                "Image uploaded successfully", 
                response
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to upload image", e.getMessage()));
        }
    }

    // Upload file
    @PostMapping("/upload/file")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            // Validate file
            String validationError = validateFile(file);
            if (validationError != null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("File upload failed", validationError));
            }

            // Create upload directory if it doesn't exist
            createUploadDirectory();

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFilename);
            String uniqueFilename = generateUniqueFilename("file", fileExtension);

            // Save file
            Path filePath = Paths.get(uploadDir, "files", uniqueFilename);
            Files.createDirectories(filePath.getParent());
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Generate URL
            String fileUrl = baseUrl + "/api/v1/media/files/" + uniqueFilename;

            Map<String, String> response = new HashMap<>();
            response.put("filename", uniqueFilename);
            response.put("originalName", originalFilename);
            response.put("url", fileUrl);
            response.put("size", String.valueOf(file.getSize()));
            response.put("type", file.getContentType());

            return ResponseEntity.ok(ApiResponse.success(
                "File uploaded successfully", 
                response
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to upload file", e.getMessage()));
        }
    }

    // Serve images
    @GetMapping("/images/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir, "images", filename);
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            byte[] fileContent = Files.readAllBytes(filePath);
            String contentType = Files.probeContentType(filePath);
            
            return ResponseEntity.ok()
                    .header("Content-Type", contentType != null ? contentType : "application/octet-stream")
                    .body(fileContent);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Serve files
    @GetMapping("/files/{filename}")
    public ResponseEntity<byte[]> getFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir, "files", filename);
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            byte[] fileContent = Files.readAllBytes(filePath);
            String contentType = Files.probeContentType(filePath);
            
            return ResponseEntity.ok()
                    .header("Content-Type", contentType != null ? contentType : "application/octet-stream")
                    .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                    .body(fileContent);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete media file
    @DeleteMapping("/{type}/{filename}")
    public ResponseEntity<ApiResponse<String>> deleteMedia(
            @PathVariable String type,
            @PathVariable String filename,
            Authentication authentication) {
        try {
            if (!type.equals("images") && !type.equals("files")) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Invalid media type", "Type must be 'images' or 'files'"));
            }

            Path filePath = Paths.get(uploadDir, type, filename);
            if (!Files.exists(filePath)) {
                return ResponseEntity.status(404)
                        .body(ApiResponse.error("File not found", "The requested file does not exist"));
            }

            Files.delete(filePath);

            return ResponseEntity.ok(ApiResponse.success(
                "Media deleted successfully", 
                "File " + filename + " has been deleted"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete media", e.getMessage()));
        }
    }

    // Private helper methods
    private String validateImageFile(MultipartFile file) {
        if (file.isEmpty()) {
            return "File is empty";
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            return "File size exceeds maximum limit of 10MB";
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
            return "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed";
        }

        return null;
    }

    private String validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            return "File is empty";
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            return "File size exceeds maximum limit of 10MB";
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_FILE_TYPES.contains(contentType.toLowerCase())) {
            return "Invalid file type. Only PDF, Word documents, text files, and ZIP archives are allowed";
        }

        return null;
    }

    private void createUploadDirectory() throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        Path imagesPath = Paths.get(uploadDir, "images");
        Path filesPath = Paths.get(uploadDir, "files");

        Files.createDirectories(uploadPath);
        Files.createDirectories(imagesPath);
        Files.createDirectories(filesPath);
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.isEmpty()) {
            return "";
        }
        int lastDotIndex = filename.lastIndexOf('.');
        return lastDotIndex > 0 ? filename.substring(lastDotIndex) : "";
    }

    private String generateUniqueFilename(String prefix, String extension) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        return prefix + "_" + timestamp + "_" + uuid + extension;
    }
}
