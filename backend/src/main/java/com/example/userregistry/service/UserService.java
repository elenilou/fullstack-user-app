package com.example.userregistry.service;

import com.example.userregistry.model.*;
import com.example.userregistry.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public User createUser(User user){
        return userRepository.save(user);
    }

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id){
        return userRepository.findById(id);
    }

    public User updateUser(Long id, User updateUser){
        return userRepository.findById(id)
                .map(existingUser -> {
                    existingUser.setName(updateUser.getName());
                    existingUser.setSurname(updateUser.getSurname());
                    existingUser.setGender(updateUser.getGender());
                    existingUser.setBirthdate(updateUser.getBirthdate());
                    return userRepository.save(existingUser);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public void deleteUser(Long id){
        if(!userRepository.existsById(id)){
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    public User addAddressToUser(Long userId, Address address){
        return userRepository.findById(userId)
                .map(user ->{
                    user.addAddress(address);
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    public User removeAddressFromUser(Long userId, Long addressId){
        return userRepository.findById(userId)
                .map(user -> {
                    user.getAddresses().removeIf(address -> address.getId().equals(addressId));
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

}
