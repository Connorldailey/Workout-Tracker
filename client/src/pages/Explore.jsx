import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Dropdown, Spinner } from 'react-bootstrap';
import { useLazyQuery, useQuery } from '@apollo/client';
import { 
    SEARCH_BY_NAME, 
    SEARCH_BY_TARGET, 
    SEARCH_BY_EQUIPMENT,
    GET_TARGET_LIST,
    GET_EQUIPMENT_LIST,
    GET_BODYPART_LIST
} from '../utils/queries';
import ExerciseCard from '../components/ExerciseCard';

const ExplorePage = () => {
    const [searchText, setSearchText] = useState('');
    const [selectedTarget, setSelectedTarget] = useState('');
    const [selectedEquipment, setSelectedEquipment] = useState('');
    const [searchType, setSearchType] = useState('');
    const [pageIndex, setPageIndex] = useState(0);

    // Lazy query for exercises by name
    const [searchExercisesByName, { data: searchedByName, loading: loadingByName, error: searchByNameError }] = useLazyQuery(SEARCH_BY_NAME);
    // Lazy query for exercises by target
    const [searchExercisesByTarget, { data: searchedByTarget, loading: loadingByTarget, error: searchByTargetError }] = useLazyQuery(SEARCH_BY_TARGET);
    // Lazy query for exercises by equipment
    const [searchExercisesByEquipment, { data: searchedByEquipment, loading: loadingByEquipment, error: searchByEquipmentError }] = useLazyQuery(SEARCH_BY_EQUIPMENT);
    // Query for the target list
    const { data: targetListData, error: targetListError } = useQuery(GET_TARGET_LIST);
    // Query for the equipment list
    const { data: equipmentListData, error: equipmentListError } = useQuery(GET_EQUIPMENT_LIST);

    const handleInputChange = (event) => {
        setSearchText(event.target.value);
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        setPageIndex(0);
        setSelectedTarget('');
        setSelectedEquipment('');
        setSearchType('name');
        searchExercisesByName({ variables: { name: searchText, offset: 0 } });
    }

    const handleSearchByTarget = (target, offset = 0) => {
        setSelectedTarget(target);
        setSearchText('');
        setSelectedEquipment('');
        setSearchType('target');
        searchExercisesByTarget({ variables: { target: target, offset: offset } });
    }

    const handleSearchByEquipment = (equipment, offset = 0) => {
        setSearchText('');
        setSelectedTarget('');
        setSelectedEquipment(equipment);
        setSearchType('equipment');
        searchExercisesByEquipment({ variables: { equipment: equipment, offset: offset } });
    }

    const handlePageChange = (newPageIndex) => {
        setPageIndex(newPageIndex);
        const offset = newPageIndex * 10;
        if (searchType === 'name') {
            searchExercisesByName({ variables: { name: searchText, offset } });
        } else if (searchType === 'target') {
            searchExercisesByTarget({ variables: { target: selectedTarget, offset } });
        } else if (searchType === 'equipment') {
            searchExercisesByEquipment({ variables: { equipment: selectedEquipment, offset: offset } });
        }
    };

    const isLoading = () => {
        if (searchType === 'name') return loadingByName;
        if (searchType === 'target') return loadingByTarget;
        if (searchType === 'equipment') return loadingByEquipment;
        return false;
    };

    const displayedExercises =
        searchType === 'name'
            ? searchedByName?.exercisesByName || []
            : searchType === 'target'
            ? searchedByTarget?.exercisesByTarget || []
            : searchType === 'equipment'
            ? searchedByEquipment?.exercisesByEquipment || []
            : [];

    return (
        <>
            <h1 className='mb-3'>Explore</h1>
            <Container fluid>
                <Row>
                    <Col xs={12} md={4}>
                        <Container>
                            <h2>Categories</h2>
                            <h4>Target Muscles</h4>
                            <Dropdown>
                                <Dropdown.Toggle variant="primary" id="dropdown-target">
                                    {selectedTarget
                                        ? selectedTarget.charAt(0).toUpperCase() + selectedTarget.slice(1)
                                        : 'Select Target Muscle'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {targetListData && targetListData.targetList && targetListData.targetList.map((target, index) => (
                                        <Dropdown.Item key={index} onClick={() => {
                                            handleSearchByTarget(target, 0)
                                            setPageIndex(0);
                                        }}>
                                            {target.split('')[0].toUpperCase() + target.split('').splice(1).join('')}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                            <h4>Equipment</h4>
                            <Dropdown>
                                <Dropdown.Toggle variant="primary" id="dropdown-target">
                                    {selectedEquipment
                                        ? selectedEquipment.charAt(0).toUpperCase() + selectedEquipment.slice(1)
                                        : 'Select Equipment'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {equipmentListData && equipmentListData.equipmentList && equipmentListData.equipmentList.map((equipment, index) => (
                                        <Dropdown.Item key={index} onClick={() => {
                                            handleSearchByEquipment(equipment, 0)
                                            setPageIndex(0);
                                        }}>
                                            {equipment.split('')[0].toUpperCase() + equipment.split('').splice(1).join('')}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                            
                        </Container>
                    </Col>
                    <Col xs={12} md={8}>
                        <Form onSubmit={handleFormSubmit} className='d-flex mb-3'>
                            <Form.Group className='me-3 w-100'>
                                <Form.Control 
                                    type='text' 
                                    placeholder='Search for an exercise...'
                                    name='exercise-search' 
                                    onChange={handleInputChange}
                                    value={searchText}
                                />
                            </Form.Group>
                            <Button type='submit'>Submit</Button>
                        </Form>
                        {isLoading() ? (
                            <Container className="text-center my-3">
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </Container>
                        ) : (
                            <ExerciseCard data={displayedExercises} />
                        )}
                    </Col>
                </Row>
            </Container>

            {searchType && displayedExercises.length > 0 && !isLoading() && (
                <Container className="text-center">
                    {[0, 1, 2, 3, 4].map((page) => (
                        <Button
                            key={page}
                            variant={pageIndex === page ? "primary" : "secondary"}
                            onClick={() => handlePageChange(page)}
                            className="me-2"
                        >
                            {page + 1}
                        </Button>
                    ))}
                </Container>
            )}
            {searchByNameError && <p>Error: {searchByNameError.message}</p>}
            {searchByTargetError && <p>Error: {searchByTargetError.message}</p>}
            {targetListError && <p>Error: {targetListError.message}</p>}
            {equipmentListError && <p>Error: {equipmentListError.message}</p>}
        </>
    );
};

export default ExplorePage;