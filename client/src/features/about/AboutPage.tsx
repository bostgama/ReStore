import { Alert, AlertTitle, Button, ButtonGroup, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { useState } from "react";
import agent from "../../app/api/agent";

export default function AboutPage() {

    const [validationErrors, setValidationErrors]= useState<string[]>([]);

    function getValidationError() {
        agent.TestError.getValidationError()
            .then(() => console.log('should not see this'))
            .catch( (error)=> setValidationErrors(error));
    }

    return (
        <Container>
            <Typography gutterBottom variant='h2'> Errors for testing purposes</Typography>
            <ButtonGroup fullWidth>
                <Button variant='contained' onClick={(() => agent.TestError.get400Error().catch(error => console.log(error)))}>Test 400 Error</Button>
                <Button variant='contained' onClick={(() => agent.TestError.get401Error().catch(error => console.log(error)))}>Test 401 Error</Button>
                <Button variant='contained' onClick={(() => agent.TestError.get404Error().catch(error => console.log(error)))}>Test 404 Error</Button>
                <Button variant='contained' onClick={(() => agent.TestError.get500Error().catch(error => console.log(error)))}>Test 500 Error</Button>
                <Button variant='contained' onClick={getValidationError}>Test Validation</Button>
            </ButtonGroup>
            {validationErrors.length > 0 && 
                <Alert>
                    <AlertTitle>Validation Errors</AlertTitle>
                    <List>
                        {validationErrors.map(error=> (
                            <ListItem key={error}>
                                <ListItemText>{error}</ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </Alert>}
        </Container>
    )
}