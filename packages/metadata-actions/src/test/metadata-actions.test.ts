import { applyActions, ifMetadata, updateMetadata } from '../lib/metadata-actions';

describe('applyActions', () => {
    const actionWithNoReturnValue = jest.fn();
    const actionWithReturnValue = jest.fn();
    const actionFollowingReturnValue = jest.fn();
    const actionReturnValue = {};
    const metadata = {};
    const context = {};
    const actionList = [actionWithNoReturnValue, actionWithReturnValue, actionFollowingReturnValue];

    beforeEach(() => {
        jest.clearAllMocks();
        actionWithReturnValue.mockReturnValue(actionReturnValue);
    });

    it('should call the action with the given metadata and context', () => {
        applyActions(metadata, context, actionWithNoReturnValue);

        expect(actionWithNoReturnValue).toHaveBeenCalledWith(metadata, context);
    });

    it('should return the original metadata if the action returns void', () => {
        const returnValue = applyActions(metadata, context, actionWithNoReturnValue);

        expect(returnValue).toBe(metadata);
    });

    it('should return the action\'s return value', () => {
        const returnValue = applyActions(metadata, context, actionWithReturnValue);
        
        expect(returnValue).toBe(actionReturnValue);
    });

    it('should call each action in a list with the previous action\'s return value', () => {
        applyActions(metadata, context, actionList);

        expect(actionWithNoReturnValue).toHaveBeenCalledWith(metadata, context);
        expect(actionWithReturnValue).toHaveBeenCalledWith(metadata, context);
        expect(actionFollowingReturnValue).toHaveBeenCalledWith(actionReturnValue, context);
    });

    it('should return the final action\'s return value', () => {
        const returnValue = applyActions(metadata, context, actionList);

        expect(returnValue).toBe(actionReturnValue);
    });
});


describe('ifMetadata', () => {
    const thenAction = jest.fn();
    const thenActionReturnValue = {};
    const thenActionList = [thenAction];
    const elseAction = jest.fn();
    const elseActionReturnValue = {};
    const elseActionList = [elseAction];
    const selector = jest.fn();
    const metadata = {};
    const context = {};

    beforeEach(() => {
        jest.clearAllMocks();
        thenAction.mockReturnValue(thenActionReturnValue);
        elseAction.mockReturnValue(elseActionReturnValue);
    });

    it.each([
        ['actions', thenAction, elseAction], 
        ['lists', thenActionList, elseActionList]
    ])('should return a function (%s)', (label, thenActions, elseActions) => {
        const returnValue = ifMetadata(selector, thenActions);

        expect(typeof returnValue).toBe('function');
    });

    it.each([
        ['actions', thenAction, elseAction], 
        ['list', thenActionList, elseActionList]
    ])('should call the then action(s) if the selector returns true (%s)', (label, thenActions, elseActions) => {
        selector.mockReturnValue(true);

        const action = ifMetadata(selector, thenActions);
        action(metadata, context);

        expect(thenAction).toHaveBeenCalledWith(metadata, context);
    });

    it.each([
        ['actions', thenAction, elseAction], 
        ['list', thenActionList, elseActionList]
    ])('should return the then action\'s return value (%s)', (label, thenActions, elseActions) => {
        selector.mockReturnValue(true);

        const action = ifMetadata(selector, thenActions);
        const returnValue = action(metadata, context);

        expect(returnValue).toBe(thenActionReturnValue);
    });

    it.each([
        ['actions', thenAction, elseAction], 
        ['list', thenActionList, elseActionList]
    ])('should not call the then action if the selector returns false (%s)', (label, thenActions, elseActions) => {
        selector.mockReturnValue(false);

        const action = ifMetadata(selector, thenActions);
        action(metadata, context);

        expect(thenAction).not.toHaveBeenCalled();
    });


    it.each([
        ['actions', thenAction, elseAction], 
        ['list', thenActionList, elseActionList]
    ])('should return the original metadata if the selector returns false (%s)', () => {
        selector.mockReturnValue(false);

        const action = ifMetadata(selector, thenAction);
        const returnValue = action(metadata, context);

        expect(returnValue).toBe(metadata);
    });


    it.each([
        ['actions', thenAction, elseAction], 
        ['list', thenActionList, elseActionList]
    ])('should call the else action(s) if the selector returns false (%s)', (label, thenActions, elseActions) => {
        selector.mockReturnValue(false);

        const action = ifMetadata(selector, thenActions, elseActions);
        action(metadata, context);

        expect(elseAction).toHaveBeenCalledWith(metadata, context);
    });

    it.each([
        ['actions', thenAction, elseAction], 
        ['list', thenActionList, elseActionList]
    ])('should return the else action\'s return value (%s)', (label, thenActions, elseActions) => {
        selector.mockReturnValue(false);

        const action = ifMetadata(selector, thenActions, elseActions);
        const returnValue = action(metadata, context);

        expect(returnValue).toBe(elseActionReturnValue);
    });
});



describe('updateMetadata', () => {
    const updateFn = jest.fn();
    const metadata = { a: 1 };
    const metadataUpdate = { b: 2 };
    const context = {};

    beforeEach(() => {
        jest.clearAllMocks();
        updateFn.mockReturnValue(metadataUpdate);
    })
    
    it('should return a function', () => {
        const returnValue = updateMetadata(updateFn);
        
        expect(typeof returnValue).toBe('function');
    });

    it('should call the update function with the metadata and context', () => {
        const action = updateMetadata(updateFn);
        action(metadata, context);

        expect(updateFn).toHaveBeenCalledWith(metadata, context);
    });

    it('should return the metadata merged with the update', () => {
        const action = updateMetadata(updateFn);
        const returnValue = action(metadata, context);
        const expected = { ...metadata, ...metadataUpdate };

        expect(returnValue).toMatchObject(expected);
    });
})